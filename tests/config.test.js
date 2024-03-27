const Config = require('../configs/config');
const request = require('supertest');
const { server } = require('../app');

afterEach(async () => {
    if(server) {
        server.close();
    }
});

describe('Application', () => {
    describe('Environment variable setting', () => {
        it('should read in correct environment variables from /envs/testing.env', async () => {
            // const correctConfig = {
            //     RunMode: 'test',
            //     ServerAddr: 'localhost',
            //     ServerPort: '3000',

            //     DBServerType: 'postgres',
            //     DBUser: 'postgres',
            //     DBPassword: 'password',
            //     DBAddr: '127.0.0.1',
            //     DBPort: '5432',
            //     DBName: 'jsblog',

            //     RedisAddr: 'localhost',
            //     RedisPort: '6379',
            //     RedisUser: '',
            //     RedisPassword: '',

            //     JwtIssuer: 'jsblog-server',
            //     JwtExpire: '3600',
            //     JwtSecret: 'jsblog-app-secret-key'
            // }
            const correctConfig = {
                RunMode: 'debug',
                ServerAddr: '0.0.0.0',
                ServerPort: '8000',

                DBServerType: 'postgres',
                DBUser: 'postgres',
                DBPassword: 'password',
                DBAddr: 'jsblog-app-postgredb',
                DBPort: '5432',
                DBName: 'jsblog',

                RedisAddr: 'jsblog-app-redis',
                RedisPort: '6379',
                RedisUser: '',
                RedisPassword: '',

                JwtIssuer: 'jsblog-server',
                JwtExpire: '3600',
                JwtSecret: 'jsblog-app-secret-key'
            }
            
            expect(Config).toEqual(correctConfig);
        });
    });

    describe('GET /heartbeat', () => {
        it('should 200 success and return server status in json format', async () => {
            const expectedResponse = {
                HttpServer: 'alive',
                DB: 'alive',
                Redis: 'alive'
            }

            const res = await request(server)
                .get('/heartbeat')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body).toEqual(expectedResponse);
        });
    });
});
