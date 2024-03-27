import { MODEL_PRODUCTS } from "../../DAO/models/product.js";
import mongoosePaginate from 'mongoose-paginate-v2';

export default class ProductService {
    async getPaginatedProducts(query, options) {
        try {
            const leanQuery = { ...query, lean: true }; // Agregar lean: true al query
            const products = await Product.paginate({}, leanQuery, options);
            return products;
        } catch (error) {
            throw new Error(`Error getting paginated products: ${error}`);
        }
    }

    async isCodeUnique(code) {
        try {
            const products = await this.getProducts();
            return products.some((product) => product.code === code);
        } catch (error) {
            throw new Error(`Error checking code uniqueness: ${error}`);
        }
    }

    validateFields(product) {
        return (
            product.title &&
            product.description &&
            typeof product.price === 'number' &&
            typeof product.status === 'boolean' &&
            product.code &&
            typeof product.stock === 'number' &&
            product.category &&
            typeof product.title === 'string' &&
            typeof product.description === 'string' &&
            typeof product.code === 'string' &&
            typeof product.category === 'string'
        );
    }

    async addProduct(product) {
        try {
            if (await this.isCodeUnique(product.code)) {
                return { code: 409, status: 'Este producto ya existe' };
            }
            if (!this.validateFields(product)) {
                return { code: 400, status: 'Todos los campos del producto deben ser ingresados' };
            }
            let result = await MODEL_PRODUCTS.create(product);
            return { code: 200, status: 'Producto agregado', product: result };
        } catch (error) {
            throw new Error(`Error adding product: ${error}`);
        }
    }

    async getProducts() {
        try {
            const products = await MODEL_PRODUCTS.find();
            return products.map(product => product.toObject());
        } catch (error) {
            throw new Error(`Error getting products: ${error}`);
        }
    }

    async getProductById(id) {
        try {
            const product = await MODEL_PRODUCTS.findById(id);
            return product ? product : false;
        } catch (error) {
            throw new Error(`Error getting product by ID: ${error}`);
        }
    }

    async deleteProductById(id) {
        try {
            const product = await this.getProductById(id);
            if (product) {
                await MODEL_PRODUCTS.deleteOne({ _id: id });
                return { code: 200, status: 'Producto eliminado' };
            } else {
                return { code: 404, status: 'Producto no existe' };
            }
        } catch (error) {
            throw new Error(`Error deleting product by ID: ${error}`);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const product = await MODEL_PRODUCTS.findByIdAndUpdate(id, updatedFields, { new: true });
            if (product) {
                return { code: 200, status: 'Producto actualizado' };
            } else {
                return { code: 404, status: 'Producto no encontrado' };
            }
        } catch (error) {
            throw new Error(`Error updating product: ${error}`);
        }
    }
}