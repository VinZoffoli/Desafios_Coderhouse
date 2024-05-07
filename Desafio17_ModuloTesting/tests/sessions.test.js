import * as chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const request = supertest('http://localhost:3000');

describe('Sessions Router', () => {
    it('should log in a user and return a session cookie', async () => {
        const userData = {
            email: 'vinzoffoli@gmail.com',
            password: '$2b$10$VKqz.9mV5h9ajAAdBziXs.EgrvHBueIfNQe1Qson68cAEV.ch1.0W'
        };
        const response = await request.post('/auth/login').send(userData);
        expect(response.status).to.equal(200);
        expect(response.headers['set-cookie']).to.be.an('array');
    });

    it('should retrieve user information based on the session cookie', async () => {
        const cookie = '3W8Xr4hL7fPnCzTnU3fR2eT9kV3vP9xY'; // Reemplaza esto con un valor válido de cookie de sesión
        const response = await request.get('/auth/user').set('Cookie', cookie);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
    });

    it('should register a new user', async () => {
        const newUser = {
            email: 'vin2@gmail.com',
            password: '12345'
        };
        const response = await request.post('/auth/register').send(newUser);
        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
    });
});
