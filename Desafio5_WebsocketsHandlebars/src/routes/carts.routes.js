import { Router } from "express";
import CartManager from "../controllers/cart.controller.js";

const router = Router();
const manager = new CartManager('./src/data/cart.json');

router.post('/', async (req, res) => {
    try {
        let status = await manager.addCart();
        res.status(status.code).json({status: status.status});
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
})

router.get('/', async (req, res) => {
    try {
        const carts = await manager.getCarts();
        res.json({ status: "success", payload: carts });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        let status = await manager.addProductToCart(parseInt(cid), parseInt(pid));
        res.status(status.code).json({status: status.status});
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
})

export default router;