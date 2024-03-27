const request = require('supertest');
const { server }= require('../app');

afterEach(async () => {
    if(server) {
        server.close();
    }
});

describe('GET /login', () => {
    it('should 200 success', async () => {
        await request(server)
            .get('/login')
            .expect(200);
    });
});

describe('POST /login', () => {
    it('should 200 success login and return access_token', async () => {
        const testAccount = 'tester@example.com';
        const testPassword = '123456';
        const loginPayload = {
            account: testAccount,
            password: testPassword
        }
        const jwtTokenInRegex = /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/;
        
        const res = await request(server)
            .post('/login')
            .type('application/x-www-form-urlencoded')
            .send(loginPayload)
            .expect(200);
        
        expect(res.body.token).toMatch(jwtTokenInRegex);
    });
});
