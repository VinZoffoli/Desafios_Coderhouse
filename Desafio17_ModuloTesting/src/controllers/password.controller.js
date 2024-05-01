import UserModel from '../DAO/models/user.js';
import TokenModel from '../DAO/models/token.js';
import sendPasswordResetEmail from '../utils/nodemailer.util.js';
import CustomError from '../handlers/errors/custom-error.js';
import EErrors from '../handlers/errors/enum-errors.js';
import crypto from 'crypto';

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).render('forgot-password', { error: 'Usuario no encontrado' });
        }
        const token = await TokenModel.create({
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

const resetPasswordForm = async (req, res) => {
    try {
        const token = req.params.token;
        const tokenData = await TokenModel.findOne({ token });
        if (!tokenData || tokenData.expiresAt < Date.now()) {
            return res.status(400).render('reset-password', { error: 'El token ha expirado o no es válido' });
        }
        res.render('reset-password', { token });
    } catch (error) {
        console.error('Error al mostrar formulario de restablecimiento de contraseña:', error);
        res.status(500).render('reset-password', { error: 'Error interno del servidor' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const tokenData = await TokenModel.findOne({ token });
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
        user.role = 'user'; 
        await user.save();
        res.status(200).render('reset-password', { message: 'Contraseña restablecida correctamente' });
    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        res.status(500).render('reset-password', { error: 'Error interno del servidor' });
    }
};

export default {
    forgotPassword,
    resetPasswordForm,
    resetPassword
};
