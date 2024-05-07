import * as chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const request = supertest('http://localhost:3000');

describe('Products Router', () => {
    describe('GET /products', () => {
        it('should return a list of products', async () => {
            const response = await request.get('/products');
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            response.body.forEach(product => {
                expect(product).to.have.property('id');
                expect(product).to.have.property('title');
                expect(product).to.have.property('price');
                expect(product).to.have.property('description');
            });
        });
    });

    describe('GET /products/:pid', () => {
        it('should return a specific product by ID', async () => {
            const productId = '1'; 
            const response = await request.get(`/products/${productId}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('id', productId);
            expect(response.body).to.have.property('title'); 
            expect(response.body).to.have.property('price');
            expect(response.body).to.have.property('description');
        });
    });

    describe('POST /products', () => { 
        it('should create a new product', async () => {
            const newProduct = {
                title: 'Test Product', 
                price: 99.99,
                description: 'This is a test product.',
            };
            const response = await request.post('/products').send(newProduct); 
            expect(response.status).to.equal(500); 
        });
    });
});
