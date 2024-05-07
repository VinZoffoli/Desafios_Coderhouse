import { Router } from 'express';
import * as UserModel from '../DAO/models/user.js';
import { CartModel } from '../DAO/models/cart.js';
import CartManager from "../services/db/cart.service.js";
import { MODEL_CARTS } from "../DAO/models/cart.js";
import Product from "../DAO/models/product.js";

const manager = new CartManager('./src/data/cart.json');
const router = Router();

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Agregar un producto al carrito.
 *     description: Agrega un producto al carrito de un usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Producto agregado al carrito correctamente.
 *       '500':
 *         description: Error en el servidor.
 */
router.post('/add', async (req, res, next) => {
    try {
        const { productId } = req.body;
        const { userId } = req.session;

        let user = await UserModel.findById(userId);

        if (!user) {
            return res.status(500).json({ error: 'Usuario no encontrado' }); 
        }

        let cart;

        if (!user.cartId) {
            cart = await CartModel.create({ products: [productId] });
            user.cartId = cart._id;
        } else {
            cart = await CartModel.findById(user.cartId);
            cart.products.push(productId);
            await cart.save();
        }

        await user.save();
        res.status(201).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        next(error);
    }
});


/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Crear un nuevo carrito.
 *     description: Crea un nuevo carrito.
 *     responses:
 *       '200':
 *         description: Carrito creado correctamente.
 *       '500':
 *         description: Error en el servidor.
 */
router.post('/', async (req, res) => {
    try {
        const newCart = await CartModel.create({ products: [] }); 
        res.status(201).json({ message: 'Carrito creado correctamente', cartId: newCart._id });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});

/**
 * @swagger
 * /cart/{cid}:
 *   get:
 *     summary: Obtener un carrito por ID.
 *     description: Retorna un carrito específico por su ID.
 *     parameters:
 *       - name: cid
 *         in: path
 *         description: ID del carrito.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Éxito, se obtiene el carrito.
 *       '404':
 *         description: Carrito no encontrado.
 *       '500':
 *         description: Error en el servidor.
 */
router.get('/:cid', async (req, res) => {
    try {
        const cart = await MODEL_CARTS.findById(req.params.cid).populate('products.product').lean();

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        console.log(cart);

        res.status(200).json(cart); 
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});


/**
 * @swagger
 * /cart/{cid}/product/{pid}:
 *   post:
 *     summary: Agregar un producto específico al carrito.
 *     description: Agrega un producto específico al carrito.
 *     parameters:
 *       - name: cid
 *         in: path
 *         description: ID del carrito.
 *         required: true
 *         schema:
 *           type: string
 *       - name: pid
 *         in: path
 *         description: ID del producto.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Producto agregado al carrito correctamente.
 *       '404':
 *         description: Producto no encontrado.
 *       '500':
 *         description: Error en el servidor.
 */
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        let quantity = 1;

        if (req.body.quantity) {
            quantity = req.body.quantity;
        }

        const product = await Product.findById(pid);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const status = await manager.addProductToCart(cid, pid, quantity);
        res.status(status.code).json({ status: status.status });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});

/**
 * @swagger
 * /cart/{cid}/product/{pid}:
 *   delete:
 *     summary: Eliminar un producto específico del carrito.
 *     description: Elimina un producto específico del carrito.
 *     parameters:
 *       - name: cid
 *         in: path
 *         description: ID del carrito.
 *         required: true
 *         schema:
 *           type: string
 *       - name: pid
 *         in: path
 *         description: ID del producto.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Producto eliminado del carrito correctamente.
 *       '500':
 *         description: Error en el servidor.
 */
router.delete('/:cid/product/:pid', async (req, res) => {
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

/**
 * @swagger
 * /cart/{cid}:
 *   put:
 *     summary: Actualizar el contenido del carrito.
 *     description: Actualiza el contenido del carrito con los productos proporcionados.
 *     parameters:
 *       - name: cid
 *         in: path
 *         description: ID del carrito.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       '200':
 *         description: Carrito actualizado correctamente.
 *       '500':
 *         description: Error en el servidor.
 */
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

/**
 * @swagger
 * /cart/{cid}/product/{pid}:
 *   patch:
 *     summary: Actualizar la cantidad de un producto en el carrito.
 *     description: Actualiza la cantidad de un producto específico en el carrito.
 *     parameters:
 *       - name: cid
 *         in: path
 *         description: ID del carrito.
 *         required: true
 *         schema:
 *           type: string
 *       - name: pid
 *         in: path
 *         description: ID del producto.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Cantidad de producto actualizada correctamente en el carrito.
 *       '500':
 *         description: Error en el servidor.
 */
router.patch('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const status = await manager.updateProductQuantity(cid, pid, quantity);
        res.status(status.code).json({ status: status.status });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});

/**
 * @swagger
 * /cart/{cid}:
 *   delete:
 *     summary: Vaciar el carrito.
 *     description: Elimina todos los productos del carrito.
 *     parameters:
 *       - name: cid
 *         in: path
 *         description: ID del carrito.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Carrito vaciado correctamente.
 *       '500':
 *         description: Error en el servidor.
 */
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
