import { Router } from 'express';
import productsRouter from './products.routes.js';
import cartsRouter from './carts.routes.js';
import userController from '../controllers/user.controller.js';
import authController from '../controllers/auth.controller.js';
import ticketController from '../controllers/ticket.controller.js';
import generateProducts from '../utils/products-mock.util.js';
import passwordController from '../controllers/password.controller.js';
import ProductManager from "../services/db/product.service.js";
import { createLogger } from 'winston';

const router = Router();
const manager = new ProductManager('./src/data/products.json');
const logger = createLogger();

router.use('/auth', authController);
router.use('/user', userController);
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);

router.get('/mockingproducts/:numProducts', (req, res, next) => {
    try {
        const { numProducts } = req.params;
        const mockProducts = generateProducts(Number(numProducts));
        res.render('products', { products: mockProducts });
    } catch (error) {
        next(error); 
    }
});

// Rutas para probar el logger
router.get('/loggerTest', (req, res, next) => {
    logger.debug('Este es un mensaje de debug');
    logger.http('Este es un mensaje de http');
    logger.info('Este es un mensaje de info');
    logger.warn('Este es un mensaje de warning');
    logger.error('Este es un mensaje de error');
    logger.fatal('Este es un mensaje de fatal');

    res.json({ message: 'Prueba exitosa del logger' });
});

// Rutas para mostrar productos en tiempo real
router.get('/realTimeProducts', async (req, res) => {
    const products = await manager.getProducts();
    res.render('realTimeProducts', { products });
});

// Rutas para mostrar productos
router.get('/noRealTimeProducts', async (req, res) => {
    const products = await manager.getProducts();
    res.render('home', { products });
});

// Rutas de añadir producto
router.get('/addProduct', (req, res) => {
    res.render('addProduct');
});

// Rutas de chat
router.get('/chat', (req, res) => {
    res.render('chat');
});

//Rutas de Tickets
router.get('/tickets', ticketController.getAllTickets);
router.get('/tickets/:id', ticketController.getTicketById);
router.post('/tickets', ticketController.createTicket);
router.put('/tickets/:id', ticketController.updateTicket);
router.delete('/tickets/:id', ticketController.deleteTicket);

//Rutas de Password
router.get('/forgot-password', passwordController.forgotPassword);
router.post('/forgot-password', passwordController.forgotPassword); 
router.get('/reset-password/:token', passwordController.resetPasswordForm); 
router.post('/reset-password/:token', passwordController.resetPassword); 

export default router;