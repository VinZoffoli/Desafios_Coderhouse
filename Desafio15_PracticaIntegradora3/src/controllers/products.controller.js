import { productRepository } from '../Repository/index.js';
import CustomError from '../handlers/errors/custom-error.js';
import EErrors from '../handlers/errors/enum-errors.js';
import User from '../DAO/models/user.js';
import ProductManager from "../services/db/product.service.js";
import ProductService from "../services/db/product.service.js";

const manager = new ProductManager('./src/data/products.json');
const productService = new ProductService(); 

export const getProducts = async (req, res) => {
    try {
        const user = req.user;
        const useremail = user.email;
        const cartId = user.cartId;
        const role = user.role;

        const products = await productRepository.getItems();

        res.render('products', {
            user,
            useremail,
            role,
            cartId,
            products: products.docs,
        });
    } catch (error) {
        res.status(500).json({ error: `Error en el servidor: ${error.message}` });
    }
};

export const getPaginatedProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const productService = new ProductService();
        const products = await productService.getPaginatedProducts({ limit, page, sort, query });

        const user = req.user;
        const useremail = user.useremail;
        const cartId = user.cartId;
        const role = user.role;

        res.render('products', {
            user,
            useremail,
            role,
            cartId,
            products: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage
                ? `/products/paginate?limit=${limit}&page=${products.prevPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
                : null,

            nextLink: products.hasNextPage
                ? `/products/paginate?limit=${limit}&page=${products.nextPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
                : null,

            showPrev: products.hasPrevPage,
            showNext: products.hasNextPage,
        });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await productService.getProductById(pid);

        if (product) {
            res.send({ status: "success", payload: product });
        } else {
            res.status(404).json({ 'error': 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
};

export const createProduct = async (req, res, next) => {
    try {
        if (!req.body.title || !req.body.description || !req.body.price) {
            throw CustomError.createError({
                name: 'CustomError',
                message: 'Faltan datos para agregar el producto',
                code: EErrors.INVALID_PRODUCT_INFO,
            });
        }

        const newProduct = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price
        };

        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            throw new Error('No se pudo encontrar al usuario "admin" por defecto');
        }

        newProduct.owner = adminUser._id;

        await productRepository.addItem(newProduct);

        res.status(201).json({ success: true, message: 'Producto agregado correctamente' });
    } catch (error) {
        next(error);
    }
};

export const addProduct = async (req, res, next) => {
    try {
        let productToAdd = req.body;
        if (!('status' in productToAdd)) {
            productToAdd.status = true;
        }
        let status = await productService.addProduct(productToAdd);
        const io = getIO();
        io.emit('newProduct', status.product);
        res.status(status.code).json({ status: status.status })
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
};

export const removeProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const user = req.user;

        const product = await productRepository.getItemById(productId);

        if (!product) {
            throw CustomError.createError({
                name: 'CustomError',
                message: 'Producto no encontrado',
                code: EErrors.PRODUCT_NOT_FOUND,
            });
        }

        if (user.role === 'admin' || (user.role === 'premium' && product.owner.toString() === user._id.toString())) {
            await productRepository.deleteItem(productId);
            res.status(200).json({ success: true, message: 'Producto eliminado correctamente' });
        } else {
            throw CustomError.createError({
                name: 'CustomError',
                message: 'No tienes permiso para eliminar este producto',
                code: EErrors.UNAUTHORIZED_ACCESS,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const updateExistingProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const { title, description, price } = req.body;
        const user = req.user;

        const product = await productRepository.getItemById(productId);

        if (!product) {
            throw CustomError.createError({
                name: 'CustomError',
                message: 'Producto no encontrado',
                code: EErrors.PRODUCT_NOT_FOUND,
            });
        }

        if (user.role === 'admin' || (user.role === 'premium' && product.owner.toString() === user._id.toString())) {
            const updatedProduct = await productRepository.updateItem(productId, { title, description, price });
            res.status(200).json({ success: true, message: 'Producto actualizado correctamente', updatedProduct });
        } else {
            throw CustomError.createError({
                name: 'CustomError',
                message: 'No tienes permiso para actualizar este producto',
                code: EErrors.UNAUTHORIZED_ACCESS,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const productToUpdate = req.body;

        const status = await productService.updateProduct(pid, productToUpdate);

        res.status(status.code).json({ status: status.status });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { pid } = req.params;

        const status = await productService.deleteProductById(pid);

        res.status(status.code).json({ status: status.status });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
};