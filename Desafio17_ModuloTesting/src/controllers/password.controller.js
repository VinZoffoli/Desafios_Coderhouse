import express from 'express';
import UserModel from '../DAO/models/user.js';
import TokenModel from '../DAO/models/token.js';
import sendPasswordResetEmail from '../utils/nodemailer.util.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const token = await TokenModel.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex'),
            expiresAt: Date.now() + 3600000, 
        });
        await sendPasswordResetEmail(email, token.token);
        res.status(200).json({ message: 'Se ha enviado un correo de restablecimiento de contraseña' });
    } catch (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.get('/reset-password/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const tokenData = await TokenModel.findOne({ token });
        if (!tokenData || tokenData.expiresAt < Date.now()) {
            return res.status(400).json({ error: 'El token ha expirado o no es válido' });
        }
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error al mostrar formulario de restablecimiento de contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const tokenData = await TokenModel.findOne({ token });
        if (!tokenData || tokenData.expiresAt < Date.now()) {
            return res.status(400).json({ error: 'El token ha expirado o no es válido' });
        }
        const user = await UserModel.findById(tokenData.userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (newPassword === user.password) {
            return res.status(400).json({ error: 'La nueva contraseña debe ser diferente a la anterior' });
        }

        user.password = newPassword;
        user.role = 'user'; 
        await user.save();
        res.status(200).json({ message: 'Contraseña restablecida correctamente' });
    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;
