import { Router } from "express";
import CartManager from "../services/db/cart.service.js";
import { MODEL_CARTS } from "../services/db/models/cart.js";
import { MODEL_PRODUCTS } from "../services/db/models/product.js";

const router = Router();
const manager = new CartManager('./src/data/cart.json');

router.post('/', async (req, res) => {
    try {
        let status = await manager.addCart();
        res.status(status.code).json({ status: status.status });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await MODEL_CARTS.findById(req.params.cid).populate('products.product').lean();

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        console.log(cart);

        res.render('cart', { products: cart.products });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        let quantity = 1;

        if (req.body.quantity) {
            quantity = req.body.quantity;
        }

        const product = await MODEL_PRODUCTS.findById(pid);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const status = await manager.addProductToCart(cid, pid, quantity);
        res.status(status.code).json({ status: status.status });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});


router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        console.log(`Eliminar producto ${pid} del carrito ${cid}`);

        const status = await manager.removeProductFromCart(cid, pid);
        
        console.log('Producto eliminado con éxito');
        
        res.status(status.code).json({ status: status.status });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});


router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const status = await manager.updateCart(cid, products);
        res.status(status.code).json({ status: status.status });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const status = await manager.updateProductQuantity(cid, pid, quantity);
        res.status(status.code).json({ status: status.status });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const status = await manager.clearCart(cid);
        res.status(status.code).json({ status: status.status });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});

export default router;