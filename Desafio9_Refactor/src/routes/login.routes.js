import express from 'express';
import passport from 'passport';
import { UserModel } from '../services/db/models/user.js';

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true,
}));

export default router;
