import * as UserModel from '../DAO/models/user.js';
import { CartModel } from '../DAO/models/cart.js';
export const addToCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const { userId } = req.session; 

        let user = await UserModel.findById(userId);

        if (!user) {
            throw new Error('Usuario no encontrado');
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
        res.status(200).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        next(error);
    }
};
