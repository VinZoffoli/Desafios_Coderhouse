import Product from "../db/models/product.js";

export async function getAllProducts(query = {}, options = {}) {
    try {
        return await Product.find(query, null, options);
    } catch (error) {
        throw new Error(`Error getting products from database: ${error}`);
    }
}

export async function createProduct(productData) {
    try {
        return await Product.create(productData);
    } catch (error) {
        throw new Error(`Error creating product in database: ${error}`);
    }
}

export async function getProductById(id) {
    try {
        return await Product.findById(id);
    } catch (error) {
        throw new Error(`Error getting product by ID from database: ${error}`);
    }
}

export async function deleteProductById(id) {
    try {
        return await Product.deleteOne({ _id: id });
    } catch (error) {
        throw new Error(`Error deleting product by ID from database: ${error}`);
    }
}

export async function updateProduct(id, updatedFields) {
    try {
        return await Product.findByIdAndUpdate(id, updatedFields, { new: true });
    } catch (error) {
        throw new Error(`Error updating product in database: ${error}`);
    }
}
