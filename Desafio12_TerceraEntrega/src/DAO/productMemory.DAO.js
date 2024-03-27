import Product from './models/product.js'; 

class ProductMemoryDAO {
    async getAll() {
        try {
            console.log('estoy usando el daoMemory');
            return await Product.find();
        } catch (error) {
            throw new Error(`Error getting products from database: ${error}`);
        }
    }

    async get(id) {
        try {
            console.log('estoy usando el daoMemory');
            return await Product.findById(id);
        } catch (error) {
            throw new Error(`Error getting product by ID from database: ${error}`);
        }
    }

    async create(product) {
        try {
            console.log('estoy usando el daoMemory');
            return await Product.create(product);
        } catch (error) {
            throw new Error(`Error creating product in database: ${error}`);
        }
    }

    async delete(id) {
        try {
            console.log('estoy usando el daoMemory');
            return await Product.deleteOne({ _id: id });
        } catch (error) {
            throw new Error(`Error deleting product by ID from database: ${error}`);
        }
    }
}

export default ProductMemoryDAO;
