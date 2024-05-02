import * as chai from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';

const expect = chai.expect;
const request = supertest('http://localhost:3000');

describe('Carts Router', () => {
    describe('GET /cart', () => {
        it('should return a list of carts', async () => {
            const response = await request.get('/cart');
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });
    });

    describe('GET /cart/:id', () => {
        it('should return a specific cart by ID', async () => {
            const cartId = '1';
            const response = await request.get(`/cart/${cartId}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('id', cartId);
        });
    });

    describe('POST /cart', () => {
        it('should create a new cart', async () => {
            const newCart = {};
            const response = await request.post('/cart').send(newCart);
            expect(response.status).to.equal(201);
            expect(response.body).to.be.an('object');
        });
    });
});
