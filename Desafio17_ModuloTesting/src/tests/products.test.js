import chai from 'chai';
import supertest from 'supertest';
import app from '../src/app.js'; 

const expect = chai.expect;
const request = supertest(app);

describe('Products Router', () => {
    it('should return a list of products', async () => {
        const response = await request.get('/products');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.length.above(0);
    });

    it('should return a specific product by ID', async () => {
        const productId = '1'; 
        const response = await request.get(`/products/${productId}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id', productId);
    });

    it('should create a new product', async () => {
        const newProduct = {
            name: 'Test Product',
            price: 99.99,
            description: 'This is a test product.',
        };
        const response = await request.post('/products').send(newProduct);
        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('name', newProduct.name);
    });
});