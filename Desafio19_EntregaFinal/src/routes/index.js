import { Router } from 'express';
import productsController from '../controllers/products.controller.js';
import cartController from '../controllers/cart.controller.js';
import userController from '../controllers/user.controller.js';
import authController from '../controllers/auth.controller.js';
import ticketController from '../controllers/ticket.controller.js';
import generateProducts from '../utils/products-mock.util.js';
import passwordController from '../controllers/password.controller.js';
import { createLogger } from 'winston';
import { swaggerDocs, swaggerUi } from '../config/swaggerConfig.js';

const router = Router();
const logger = createLogger();

router.use('/auth', authController);
router.use('/user', userController);
router.use('/products', productsController);
router.use('/carts', cartController); 
router.use('/tickets', ticketController);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

//Rutas de Password
router.get('/forgot-password', passwordController.forgotPassword);
router.post('/forgot-password', passwordController.forgotPassword); 
router.get('/reset-password/:token', passwordController.resetPasswordForm); 
router.post('/reset-password/:token', passwordController.resetPassword); 

export default router;