import { Router } from "express";
import { addToCart, addCart, getCartById, addProductToCart, removeProductFromCart, updateCart, updateProductQuantity, clearCart } from "../controllers/cart.controller.js";

const router = Router();

router.post('/add-to-cart', addToCart);
router.post('/', addCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/products/:pid', removeProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', clearCart);

export default router;