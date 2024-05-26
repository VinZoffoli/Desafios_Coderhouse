import express from 'express';
import passport from 'passport';
import { generateToken } from '../middleware/generateToken.js';
import * as UserModel from '../DAO/models/user.js';
import { CartModel } from '../DAO/models/cart.js';
import sendPasswordResetEmail from '../utils/nodemailer.util.js';

const authController = express.Router();

authController.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

authController.get('/github/callback', passport.authenticate('github', {
    successRedirect: '/products/products',
    failureRedirect: '/login',
    failureFlash: true,
}));

authController.get('/login', (req, res) => {
    res.render('login');
});

authController.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true,
}), async (req, res) => {
    const tokenInfo = {
        id: req.user._id,
        role: req.user.role,
        email: req.user.email,
    };
    const token = generateToken(tokenInfo);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.redirect('/products/products');
});

authController.get('/logout', (req, res) => {
    res.clearCookie('jwt').json({ message: 'Logged out successfully' });
});

authController.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const cart = await CartModel.create({ products: [] });
        const user = await UserModel.default.create({ email, password, cartId: cart._id });
        res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
});

authController.post('/addToCart', async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;
        const user = await UserModel.default.findById(userId).populate('cartId');
        if (!user.cartId) {
            throw new Error('El usuario no tiene un carrito asociado');
        }
        const existingProductIndex = user.cartId.products.findIndex(product => product.productId.toString() === productId);
        if (existingProductIndex !== -1) {
            user.cartId.products[existingProductIndex].quantity++;
        } else {
            user.cartId.products.push({ productId, quantity: 1 });
        }

        await user.cartId.save();
        res.status(200).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        next(error);
    }
});

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).render('forgot-password', { error: 'Usuario no encontrado' });
        }
        const token = await Token.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex'),
            expiresAt: Date.now() + 3600000,
        });
        await sendPasswordResetEmail(email, token.token);
        res.status(200).render('forgot-password', { message: 'Se ha enviado un correo de restablecimiento de contraseña' });
    } catch (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error);
        res.status(500).render('forgot-password', { error: 'Error interno del servidor' });
    }
};

export const resetPasswordForm = async (req, res) => {
    try {
        const token = req.params.token;
        const tokenData = await Token.findOne({ token });
        if (!tokenData || tokenData.expiresAt < Date.now()) {
            return res.status(400).render('reset-password', { error: 'El token ha expirado o no es válido' });
        }
        res.render('reset-password', { token });
    } catch (error) {
        console.error('Error al mostrar formulario de restablecimiento de contraseña:', error);
        res.status(500).render('reset-password', { error: 'Error interno del servidor' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const tokenData = await Token.findOne({ token });
        if (!tokenData || tokenData.expiresAt < Date.now()) {
            return res.status(400).render('reset-password', { error: 'El token ha expirado o no es válido' });
        }
        const user = await UserModel.findById(tokenData.userId);
        if (!user) {
            return res.status(404).render('reset-password', { error: 'Usuario no encontrado' });
        }

        if (newPassword === user.password) {
            return res.status(400).render('reset-password', { error: 'La nueva contraseña debe ser diferente a la anterior' });
        }

        user.password = newPassword;
        await user.save();
        res.status(200).render('reset-password', { message: 'Contraseña restablecida correctamente' });
    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        res.status(500).render('reset-password', { error: 'Error interno del servidor' });
    }
};

export default authController;