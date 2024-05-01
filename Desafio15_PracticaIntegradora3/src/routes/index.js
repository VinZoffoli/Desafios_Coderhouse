import { Router } from 'express';
import productsRouter from './products.routes.js';
import cartsRouter from './carts.routes.js';
import viewProducts from './viewProducts.routes.js';
import realTimeProducts from './viewRealTimeProducts.routes.js';
import addProduct from './addProduct.routes.js';
import chat from './chat.routes.js';
import userController from '../controllers/user.controller.js';
import authController from '../controllers/auth.controller.js';
import ticketRouter from './ticket.routes.js';
import generateProducts from '../utils/products-mock.util.js';
import loggerTestRouter from './loggerTest.routes.js';
import passwordController from '../controllers/password.controller.js';

const router = Router();

router.use('/auth', authController);
router.use('/user', userController);
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/noRealTimeProducts', viewProducts);
router.use('/realTimeProducts', realTimeProducts);
router.use('/addProduct', addProduct);
router.use('/chat', chat);
router.use('/', ticketRouter); 
router.use(loggerTestRouter);

router.get('/mockingproducts/:numProducts', (req, res, next) => {
    try {
        const { numProducts } = req.params;
        const mockProducts = generateProducts(Number(numProducts));
        res.render('products', { products: mockProducts });
    } catch (error) {
        next(error); 
    }
});

router.get('/forgot-password', passwordController.forgotPassword);
router.post('/forgot-password', passwordController.forgotPassword); 
router.get('/reset-password/:token', passwordController.resetPasswordForm); 
router.post('/reset-password/:token', passwordController.resetPassword); 

export default router;