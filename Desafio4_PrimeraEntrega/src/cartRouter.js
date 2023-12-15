const express = require('express');
const Contenedor = require('./contenedor');
const router = express.Router();
const CartContenedor = require('./cartContenedor');
const cartContenedor = new CartContenedor('carrito.json');

const createCart = async () => {
    try {
        const cartId = Math.random().toString(36).substring(7);
        const cartData = {
            cartId,
            products: []
        };
        await cartContenedor.save(cartData);
        return cartId;
    } catch (error) {
        console.error(`Error al crear un carrito: ${error.message}`);
        throw error;
    }
};

const getCartProducts = async (cartId) => {
    const cartData = await cartContenedor.getById(cartId);
    return cartData ? cartData.products : [];
};

const addProductToCart = async (cartId, productId, quantity) => {
    const cartData = await cartContenedor.getById(cartId);
    
    if (cartData) {
        const existingProduct = cartData.products.find(product => product.productId === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cartData.products.push({
                productId,
                quantity
            });
        }

        await cartContenedor.updateById(cartId, cartData);
        return 'Producto agregado al carrito';
    } else {
        return 'Carrito no encontrado';
    }
};

router.post('/', async (req, res) => {
    try {
        const newCartId = await createCart();
        res.status(201).json({ message: 'Nuevo carrito creado', cartId: newCartId });
    } catch (error) {
        console.error(`Error al crear un carrito: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartProducts = await getCartProducts(cid);
        res.status(200).json(cartProducts);
    } catch (error) {
        console.error(`Error al obtener productos del carrito: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const result = await addProductToCart(cid, pid, quantity);
        res.status(201).json({ message: result });
    } catch (error) {
        console.error(`Error al agregar producto al carrito: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
