import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const request = supertest('http://localhost:3000');

describe('Carts Router', () => {
    describe('GET /carts', () => { 
        it('should return a list of carts', async () => {
            const response = await request.get('/carts');
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });
    });

    describe('GET /carts/:id', () => { 
        it('should return a specific cart by ID', async () => {
            const cartId = '6602bd970f5c99e965cce7cb';
            const response = await request.get(`/carts/${cartId}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('object');
        });
    });

    describe('POST /carts/add', () => { 
        it('should create a new cart', async () => {
            const newCart = {};
            const response = await request.post('/carts/add').send(newCart);
            expect(response.status).to.equal(201);
            expect(response.body).to.be.an('object');
        });
    });
});
