import {CartModel} from './models/cart.js';
class CartDAO {
    async getAll() {
        try {
            console.log('Conexión exitosa a DAO Mongo para carritos');
            return await CartModel.find(); 
        } catch (error) {
            throw new Error(`Error al obtener carritos desde la base de datos: ${error}`);
        }
    }

    async get(id) {
        try {
            console.log('Conexión exitosa a DAO Mongo para carritos');
            return await CartModel.findById(id); 
        } catch (error) {
            throw new Error(`Error al obtener carrito por ID desde la base de datos: ${error}`);
        }
    }

    async create(cart) {
        try {
            console.log('Conexión exitosa a DAO Mongo para carritos');
            return await CartModel.create(cart); 
        } catch (error) {
            throw new Error(`Error al crear carrito en la base de datos: ${error}`);
        }
    }

    async delete(id) {
        try {
            console.log('Conexión exitosa a DAO Mongo para carritos');
            return await CartModel.deleteOne({ _id: id });
        } catch (error) {
            throw new Error(`Error al eliminar carrito por ID desde la base de datos: ${error}`);
        }
    }
}

export default CartDAO;
