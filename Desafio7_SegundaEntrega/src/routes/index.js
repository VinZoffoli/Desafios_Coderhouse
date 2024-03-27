import { Router } from "express";
import productsRouter from "./products.routes.js";
import cartsRouter from "./carts.routes.js";
import viewProducts from "./viewProducts.routes.js";
import realTimeProducts from "./viewRealTimeProducts.routes.js";
import addProduct from "./addProduct.routes.js";
import chat from "./chat.routes.js";

const router = Router();

router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/noRealTimeProducts', viewProducts);
router.use('/realTimeProducts', realTimeProducts);
router.use('/addProduct', addProduct);
router.use('/chat', chat);

export default router;