import { Router } from 'express';
import productsRouter from './products.routes.js';
import cartsRouter from './carts.routes.js';
import viewProducts from './viewProducts.routes.js';
import realTimeProducts from './viewRealTimeProducts.routes.js';
import addProduct from './addProduct.routes.js';
import chat from './chat.routes.js';
import userController from '../controllers/user.controller.js';
import authController from '../controllers/auth.controller.js';

const router = Router();

//Fijate que todo los archivos que tenes en la carpeta Router son Controllers. Por eso se pasó auth y user a la carpeta controller. Lo mismo debería hacerce con los demas
router.use('/auth', authController);
router.use('/user', userController);

//Pasar a controllers, renombrandolos y pasandolos a la carpeta controllers
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/noRealTimeProducts', viewProducts);
router.use('/realTimeProducts', realTimeProducts);
router.use('/addProduct', addProduct);
router.use('/chat', chat);


//router.get('/', (req, res) => { res.redirect('/auth/login'); });


export default router;
