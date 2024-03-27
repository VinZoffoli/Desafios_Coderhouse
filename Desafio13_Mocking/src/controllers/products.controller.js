import { productRepository } from '../Repository/index.js';
import CustomError from '../handlers/errors/custom-error.js';
import EErrors from '../handlers/errors/enum-errors.js';

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

export const addProduct = async (req, res, next) => {
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

        await productRepository.addItem(newProduct);

        res.status(201).json({ success: true, message: 'Producto agregado correctamente' });
    } catch (error) {
        next(error);
    }
};