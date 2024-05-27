import { Router } from 'express';
import UserModel from '../DAO/models/user.js';
import { CartModel } from '../DAO/models/cart.js';
import CartManager from "../services/db/cart.service.js";
import Product from "../DAO/models/product.js";
import sendEmail from "../services/db/email.service.js";
import TicketService from "../services/db/ticket.service.js";

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
        const userId = req.session.passport.user;

        if (!userId) {
            return res.status(500).json({ error: 'ID de usuario no encontrado en la sesión' });
        }

        let user = await UserModel.findById(userId);

        if (!user) {
            return res.status(500).json({ error: 'Usuario no encontrado' });
        }

        let cart;

        if (!user.cartId) {
            cart = await CartModel.create({ products: [{ product: productId, quantity: 1 }] });
            user.cartId = cart._id;
        } else {
            cart = await CartModel.findById(user.cartId);
            const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (existingProductIndex !== -1) {
                console.log('El producto ya está en el carrito. Índice:', existingProductIndex);
                cart.products[existingProductIndex].quantity += 1;
            } else {
                console.log('El producto no está en el carrito. Añadiendo nuevo producto.');
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();
        }

        await user.save();
        res.status(201).json({ message: 'Producto agregado al carrito', cookies: req.headers['set-cookie'] });
    } catch (error) {
        console.error('Error en la creación del carrito:', error);
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
        const cart = await CartModel.findById(req.params.cid).populate('products.product').lean();

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        let totalPrice = 0;
        let totalCartPrice = 0;

        cart.products.forEach(product => {
            product.totalPrice = product.product.price * product.quantity;
            totalPrice += product.totalPrice;
            totalCartPrice += product.product.price * product.quantity; // Sumar al total del carrito
        });

        res.render('cart', { products: cart.products, cartId: req.params.cid, totalPrice, totalCartPrice });
    } catch (error) {
        res.status(500).json({ error: `Ocurrió un error en el servidor: ${error}` });
    }
});

// Endpoint para obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await CartModel.find().lean();
        res.status(200).json(carts);
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
        let quantity = req.body.quantity || 1;
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
        const status = await manager.removeProductFromCart(cid, pid);
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

router.post('/complete', async (req, res, next) => {
    try {
        const userId = req.session.passport.user;

        if (!userId) {
            return res.status(500).json({ error: 'ID de usuario no encontrado en la sesión' });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(500).json({ error: 'Usuario no encontrado' });
        }

        const cartId = user.cartId;
        const cart = await CartModel.findById(cartId).populate('products.product');

        if (!cart) {
            return res.status(500).json({ error: 'Carrito no encontrado' });
        }

        const ticketContent = await TicketService.generateTicket(user, cart.products);

        await sendEmail(user.email, 'Ticket de compra', ticketContent);

        await manager.clearCart(cartId);

        res.status(200).json({ message: 'Compra completada exitosamente' });
    } catch (error) {
        console.error('Error al completar la compra:', error);
        next(error);
    }
});

export default router;