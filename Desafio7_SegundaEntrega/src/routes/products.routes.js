import { Router } from "express";
import ProductManager from "../services/db/product.service.js";
import { getIO } from "../app.js";
import { MODEL_PRODUCTS } from "../services/db/models/product.js";
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const router = Router();
const manager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
    
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
            lean: true,
        };

        const queryObject = {};
        if (query) {
            queryObject.$or = [
                { category: new RegExp(query, 'i') },
                { availability: new RegExp(query, 'i') },
            ];
        }

        const products = await MODEL_PRODUCTS.paginate(queryObject, options);

        res.render('products', {
            products: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage
                ? `/products?limit=${limit}&page=${products.prevPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
                : null,

            nextLink: products.hasNextPage
                ? `/products?limit=${limit}&page=${products.nextPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
                : null,

            showPrev: products.hasPrevPage,
            showNext: products.hasNextPage,
        });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});

router.post('/', async (req, res) => {
    try {
        let productToAdd = req.body;
        if (!('status' in productToAdd)) {
            productToAdd.status = true;
        }
        let status = await manager.addProduct(productToAdd);
        const io = getIO();
        io.emit('newProduct', status.product);
        res.status(status.code).json({ status: status.status })
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await manager.getProductById(pid);
    if (product) {
        res.send({ status: "success", payload: product });
    } else {
        res.status(404).json({ 'error': 'Producto no encontrado' });
    }
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    let productToUpdate = req.body;
    let status = await manager.updateProduct(pid, productToUpdate);
    res.status(status.code).json({ status: status.status });
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    const status = await manager.deleteProductById(pid);
    const io = getIO();
    io.emit('deleteProduct', pid);
    res.status(status.code).json({ status: status.status });
});

export default router;
