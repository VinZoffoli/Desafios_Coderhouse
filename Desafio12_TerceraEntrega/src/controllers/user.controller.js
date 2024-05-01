import express from "express";
import passport from '../config/passportConfig.js';
import { UserModel } from '../DAO/models/user.js';

const userController = express.Router();


userController.get('/register', (req, res) => {
    res.render('register');
});
// Ruta para manejar el registro de usuarios
userController.post('/register', async (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.render('register', { error: 'El usuario ya existe' });
        }
        const newUser = new UserModel({ email, firstName, lastName, password });
        await newUser.save();
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.render('register', { error: 'Error al registrar usuario' });
    }
});


// Ruta privada para obtener el perfil del usuario actual
userController.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});


userController.get('/', async (req, res) => {
    const users = await UserModel.find();
    res.json(users);
});


export default userController;