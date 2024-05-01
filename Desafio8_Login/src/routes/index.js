import { Router } from "express";
import productsRouter from "./products.routes.js";
import cartsRouter from "./carts.routes.js";
import viewProducts from "./viewProducts.routes.js";
import realTimeProducts from "./viewRealTimeProducts.routes.js";
import addProduct from "./addProduct.routes.js";
import chat from "./chat.routes.js";
import express from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../services/db/models/user.js'


const router = Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { email, firstName, lastName, password } = req.body;

    try {
        const newUser = await UserModel.create({
            email,
            firstName,
            lastName,
            password
        });

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.render('register', { error: 'Error en el registro' });
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = { id: user._id, email: user.email, role: user.role };
            res.redirect('/products');
        } else {
            res.render('login', { error: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new UserModel({ email, password: hashedPassword, role: 'usuario' });
        await newUser.save();

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/noRealTimeProducts', viewProducts);
router.use('/realTimeProducts', realTimeProducts);
router.use('/addProduct', addProduct);
router.use('/chat', chat);

export default router;