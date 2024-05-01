import express from "express";
import passport from '../config/passportConfig.js';
import { login, logout } from '../controllers/jwtController.js';
import { loginUser } from '../controllers/loginController.js';
import { registerUser } from '../controllers/registerController.js';
import { logoutUser } from '../controllers/logoutController.js';

const router = express.Router();

// Ruta para manejar el registro de usuarios
router.post('/register', registerUser);

// Ruta para manejar la solicitud de inicio de sesión
router.post('/login', loginUser);

// Ruta para manejar la solicitud de cierre de sesión
router.post('/logout', logoutUser);

// Ruta privada para obtener el perfil del usuario actual
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});

export default router;