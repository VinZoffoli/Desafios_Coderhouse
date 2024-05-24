import express from 'express';
import { productRepository } from '../Repository/index.js';
import CustomError from '../handlers/errors/custom-error.js';
import EErrors from '../handlers/errors/enum-errors.js';
import User from '../DAO/models/user.js';
import ProductService from "../services/db/product.service.js";
import { CartModel } from '../DAO/models/cart.js';

const router = express.Router();
const productService = new ProductService();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos.
 *     description: Retorna todos los productos disponibles.
 *     responses:
 *       '200':
 *         description: Éxito, se obtienen los productos.
 *       '500':
 *         description: Error en el servidor.
 */

router.get('/', async (req, res) => {
    try {
        res.redirect('/products/paginate');
    } catch (error) {
        res.status(500).json({ error: `Error en el servidor: ${error.message}` });
    }
});

router.get('/json', async (req, res) => {
    try {
        const products = await productRepository.getItems();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: `Error en el servidor: ${error.message}` });
    }
});

/**
 * @swagger
 * /products/paginate:
 *   get:
 *     summary: Obtener productos paginados.
 *     description: Retorna una lista de productos paginados.
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Cantidad máxima de productos por página.
 *         required: false
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         description: Número de página.
 *         required: false
 *         schema:
 *           type: integer
 *       - name: sort
 *         in: query
 *         description: Campo por el cual ordenar los resultados.
 *         required: false
 *         schema:
 *           type: string
 *       - name: query
 *         in: query
 *         description: Búsqueda por palabra clave.
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Éxito, se obtienen los productos paginados.
 *       '500':
 *         description: Error en el servidor.
 */
router.get('/paginate', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const searchQuery = {};
        if (query) {
            searchQuery.title = { $regex: new RegExp(query, 'i') };
        }

        const products = await productService.getPaginatedProducts({ limit, page, sort, searchQuery });

        const user = req.user;
        const email = user.email;
        const cartId = req.user.cartId;
        const role = user.role;

        const cart = await CartModel.findById(cartId);
        const cartCount = cart ? cart.products.length : 0;

        res.render('products', {
            user: {
                firstName: req.user.firstName, 
                role: req.user.role,
            },
            email,
            role,
            cartId,
            cartCount: cartCount,
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
        console.error(error);
        res.status(500).render('error', { message: 'Error en el servidor', error: error });
    }
});


/**
 * @swagger
 * /products/{pid}:
 *   get:
 *     summary: Obtener un producto por ID.
 *     description: Retorna un producto específico por su ID.
 *     parameters:
 *       - name: pid
 *         in: path
 *         description: ID del producto.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Éxito, se obtiene el producto.
 *       '404':
 *         description: Producto no encontrado.
 *       '500':
 *         description: Error en el servidor.
 */
router.get('/:pid', async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await productService.getProductById(pid);

        if (product) {
            res.status(200).json({ status: "success", payload: product }); 
        } else {
            res.status(404).json({ 'error': 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear un nuevo producto.
 *     description: Crea un nuevo producto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       '201':
 *         description: Producto creado correctamente.
 *       '500':
 *         description: Error en el servidor.
 */
router.post('/', async (req, res, next) => {
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
});


router.delete('/:id', async (req, res, next) => {
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
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { title, description, price } = req.body;
        const user = req.user;

        const product = await productRepository.getItemById(id); 

        if (!product) {
            throw CustomError.createError({
                name: 'CustomError',
                message: 'Producto no encontrado',
                code: EErrors.PRODUCT_NOT_FOUND,
            });
        }

        if (user.role === 'admin' || (user.role === 'premium' && product.owner.toString() === user._id.toString())) {
            const updatedProduct = await productRepository.updateItem(id, { title, description, price }); 
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
});

export default router;
