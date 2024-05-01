import { Router } from "express";
import products from "./products.routes.js";
import cart from "./carts.routes.js";
import viewProducts from "./viewProducts.routes.js";
import realTimeProducts from "./viewRealTimeProducts.routes.js";
import addProduct from "./addProduct.routes.js";
import chat from "./chat.routes.js";

const router = Router();

router.use('/api/products', products);
router.use('/api/carts', cart);
router.use('/noRealTimeProducts', viewProducts);
router.use('/realTimeProducts', realTimeProducts);
router.use('/addProduct', addProduct);
router.use('/chat', chat);

export default router;