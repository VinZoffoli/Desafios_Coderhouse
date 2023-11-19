class ProductManager {
    constructor() {
        this.products = [];
    }

    generateUniqueId() {
        return Date.now().toString();
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

        return newProduct;
    }

    getProductById(productId) {
        const product = this.products.find((p) => p.id === productId);
        if (!product) {
            throw new Error('El producto no ha sido encontrado');
        }
        return product;
    }
}

const productManager = new ProductManager();

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