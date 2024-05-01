import chai from 'chai';
import supertest from 'supertest';
import app from '../src/app.js'; 

const expect = chai.expect;
const request = supertest(app);

describe('Sessions Router', () => {
    it('should log in a user and return a session cookie', async () => {
        const userData = {
        };
        const response = await request.post('/auth/login').send(userData);
        expect(response.status).to.equal(200);
        expect(response.headers['set-cookie']).to.be.an('array');
    });

    it('should retrieve user information based on the session cookie', async () => {
        const cookie = '3W8Xr4hL7fPnCzTnU3fR2eT9kV3vP9xY'; 
        const response = await request.get('/auth/user').set('Cookie', cookie);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
    });

    it('should register a new user', async () => {
        const newUser = {
        };
        const response = await request.post('/auth/register').send(newUser);
        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
    });
});
