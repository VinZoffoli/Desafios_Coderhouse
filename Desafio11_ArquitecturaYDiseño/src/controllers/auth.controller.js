import express from 'express';
import passport from 'passport';
import {generateToken} from '../middleware/generateToken.js';

const authController = express.Router();

authController.get('/github', passport.authenticate('github',{ scope: ['user:email'] }));

authController.get('/github/callback', passport.authenticate('github', {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true,
}));

authController.get('/login', (req, res) => {
    res.render('login');
});

authController.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true,
}), (req, res) => {

    const tokenInfo = {
        id: req.user._id,
        role: req.user.role,
        email: req.user.email,
    }

    //generar el token solo con la info necesaria
    const token = generateToken(tokenInfo)

    //almacenar el token en la cookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }).json({ message: 'Logged in successfully'  });
});

authController.get('/logout', (req, res) => {
    res.clearCookie('jwt').json({ message: 'Logged out successfully' });
});

export default authController;
