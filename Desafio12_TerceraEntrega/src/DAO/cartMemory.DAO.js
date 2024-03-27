import Cart from './models/cart.js';

class CartMemoryDAO {
    async getAll() {
        try {
            console.log('Estoy usando el DAO Memory para carritos');
            return await Cart.find(); 
        } catch (error) {
            throw new Error(`Error al obtener carritos desde la base de datos: ${error}`);
        }
    }

    async get(id) {
        try {
            console.log('Estoy usando el DAO Memory para carritos');
            return await Cart.findById(id);
        } catch (error) {
            throw new Error(`Error al obtener carrito por ID desde la base de datos: ${error}`);
        }
    }

    async create(cart) {
        try {
            console.log('Estoy usando el DAO Memory para carritos');
            return await Cart.create(cart); 
        } catch (error) {
            throw new Error(`Error al crear carrito en la base de datos: ${error}`);
        }
    }

    async delete(id) {
        try {
            console.log('Estoy usando el DAO Memory para carritos');
            return await Cart.deleteOne({ _id: id });
        } catch (error) {
            throw new Error(`Error al eliminar carrito por ID desde la base de datos: ${error}`);
        }
    }
}

export default CartMemoryDAO;