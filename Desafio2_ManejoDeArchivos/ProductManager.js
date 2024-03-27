const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = this.loadProducts();
    }

    generateUniqueId() {
        return Date.now().toString();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.path, data, 'utf8');
    }

    getProducts() {
        return this.products;
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        const existingProduct = this.products.find((product) => product.code === code);
        if (existingProduct) {
            throw new Error('El código del producto ya existe');
        }
        const id = this.generateUniqueId();
        const newProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        this.products.push(newProduct);
        this.saveProducts();

        return newProduct;
    }

    getProductById(productId) {
        const product = this.products.find((p) => p.id === productId);
        if (!product) {
            throw new Error('El producto no ha sido encontrado');
        }
        return product;
    }

    updateProduct(productId, updatedProduct) {
        const index = this.products.findIndex((p) => p.id === productId);
        if (index === -1) {
            throw new Error('El producto no ha sido encontrado');
        }
        this.products[index] = { ...this.products[index], ...updatedProduct };
        this.saveProducts();
    }

    deleteProduct(productId) {
        const index = this.products.findIndex((p) => p.id === productId);
        if (index === -1) {
            throw new Error('El producto no ha sido encontrado');
        }
        this.products.splice(index, 1);
        this.saveProducts();
    }
}

const productManager = new ProductManager('productos.json');

console.log(productManager.getProducts());

const newProduct = productManager.addProduct({
    title: 'Genshin Impact: Lumine',
    description: 'Escultura de personaje',
    price: 169,
    thumbnail: 'Imagen',
    code: 'genshin01',
    stock: 25,
});

console.log(productManager.getProducts());

try {
    productManager.addProduct({
        title: 'Genshin Impact: Aether',
        description: 'Escultura de personaje',
        price: 150,
        thumbnail: 'Imagen2',
        code: 'genshin01',
        stock: 10,
    });
} catch (error) {
    console.error(error.message);
}

const retrievedProduct = productManager.getProductById(newProduct.id);
console.log(retrievedProduct);

productManager.updateProduct(newProduct.id, { price: 199, stock: 30 });
console.log(productManager.getProducts());

productManager.deleteProduct(newProduct.id);
console.log(productManager.getProducts());