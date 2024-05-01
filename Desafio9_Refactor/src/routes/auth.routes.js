import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true,
}));

export default router;
