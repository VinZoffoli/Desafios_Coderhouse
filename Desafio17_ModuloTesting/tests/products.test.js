import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const request = supertest('http://localhost:3000');

describe('Products Router', () => {
    describe('GET /products', () => {
        it('should return a list of products', async () => {
            const response = await request.get('/products');
        });
    });

    describe('GET /products/:id', () => {
        it('should return a specific product by ID', async () => {
            const productId = '1';
            const response = await request.get(`/products/${productId}`);
        });
    });

    describe('POST /products/add', () => {
        it('should create a new product', async () => {
            const newProduct = {
                name: 'Test Product',
                price: 99.99,
                description: 'This is a test product.',
            };
            const response = await request.post('/products/add').send(newProduct);
        });
    });
});
