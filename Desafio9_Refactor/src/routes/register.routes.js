import express from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../services/db/models/user.js';

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { email, firstName, lastName, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ email, firstName, lastName, password: hashedPassword });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.render('register', { error: 'Error al registrar usuario' });
    }
});

export default router;