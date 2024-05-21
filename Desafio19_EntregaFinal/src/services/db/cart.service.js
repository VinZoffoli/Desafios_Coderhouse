import { MODEL_CARTS } from "../../DAO/models/cart.js";
import Product from "../../DAO/models/product.js";
export default class CartManager {

    async addCart() {
        try {
            const newCart = {
                products: []
            };
            const result = await MODEL_CARTS.create(newCart);
            return { code: 200, status: `Carrito agregado con id: ${result.id}` };
        } catch (error) {
            console.log(error);
        }
    }

    async getCarts() {
        try {
            const carts = await MODEL_CARTS.find();
            return carts.map(cart => cart.toObject());
        } catch (error) {
            console.log(error);
        }
    }

    async getProductsOfCartById(id) {
        try {
            const cart = await MODEL_CARTS.findById(id);
            return cart ? cart.products : false;
        } catch (error) {
            console.log(error);
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const cart = await MODEL_CARTS.findById(cid);
            if (!cart) {
                return { code: 404, status: 'Carrito no encontrado' };
            }
    
            const existingProduct = cart.products.find(product => product.product.toString() === pid);
            if (existingProduct) {
                existingProduct.quantity += 1; 
            } else {
                cart.products.push({ product: pid, quantity: 1 }); 
            }
    
            await cart.save();
            return { code: 200, status: 'Producto agregado al carrito' };
        } catch (error) {
            console.log(error);
        }
    };

    async removeProductFromCart(cid, pid) {
        try {
            const cart = await MODEL_CARTS.findById(cid);
            if (!cart) {
                return { code: 404, status: 'Carrito no encontrado' };
            }
    
            cart.products = cart.products.filter(product => product.product.toString() !== pid);
            await cart.save();
    
            return { code: 200, status: 'Producto eliminado del carrito' };
        } catch (error) {
            console.log(error);
            return { code: 500, status: 'Error al eliminar el producto del carrito' };
        }
    }

    async updateCart(cid, products) {
        try {
            const cart = await MODEL_CARTS.findById(cid);
            if (!cart) {
                return { code: 404, status: 'Carrito no encontrado' };
            }

            const productsArray = await Product.find({ _id: { $in: products } });
            cart.products = productsArray.map(product => ({ product: product._id }));

            await cart.save();

            return { code: 200, status: 'Carrito actualizado' };
        } catch (error) {
            console.log(error);
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await MODEL_CARTS.findById(cid);
            if (!cart) {
                return { code: 404, status: 'Carrito no encontrado' };
            }

            const productExist = cart.products.find(product => product.product.toString() === pid);
            if (productExist) {
                productExist.quantity = quantity;
                await cart.save();
                return { code: 200, status: 'Cantidad del producto actualizada' };
            } else {
                return { code: 404, status: 'Producto no encontrado en el carrito' };
            }
        } catch (error) {
            console.log(error);
        }
    }

    async clearCart(cid) {
        try {
            const cart = await MODEL_CARTS.findById(cid);
            if (!cart) {
                return { code: 404, status: 'Carrito no encontrado' };
            }

            cart.products = [];
            await cart.save();

            return { code: 200, status: 'Carrito vaciado' };
        } catch (error) {
            console.log(error);
        }
    }

    async getCartDetails(cartId) {
        try {
            const cart = await MODEL_CARTS.findById(cartId).populate('products.product');

            if (!cart) {
                return { code: 404, status: 'Carrito no encontrado' };
            }

            return { code: 200, status: 'Detalles del carrito obtenidos', cart };
        } catch (error) {
            console.log(error);
            return { code: 500, status: 'Error interno del servidor' };
        }
    }
}