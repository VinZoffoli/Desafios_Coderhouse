import express from 'express';
import passport from 'passport';
import { generateToken } from '../middleware/generateToken.js';
import * as UserModel from '../DAO/models/user.js';
import { CartModel } from '../DAO/models/cart.js';

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
        user.cartId.products.push(productId);
        await user.cartId.save();
        res.status(200).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        next(error);
    }
});

export default authController;
