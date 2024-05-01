import chai from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';

const expect = chai.expect;
const request = supertest(app);

describe('Carts Router', () => {
    it('should return a list of carts', async () => {
        const response = await request.get('/carts');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it('should return a specific cart by ID', async () => {
        const cartId = '1';
        const response = await request.get(`/carts/${cartId}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id', cartId);
    });

    it('should create a new cart', async () => {
        const newCart = {
        };
        const response = await request.post('/carts').send(newCart);
        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
    });
});
