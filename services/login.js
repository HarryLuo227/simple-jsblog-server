const logger = require('../utils/logger');
const db = require('../db/index');
const { redisClient } = require('../db/redis');
const jwt = require('../utils/jwt');

async function login(req, res) {
    try {
        logger.debug(`User ${req.body.account} login`);

        const sql = 'SELECT * FROM users WHERE id = $1';
        const values = [res.locals.userId];
        const result = await db.exec(sql, values);

        if(req.body.account === result.rows[0].account && req.body.password === result.rows[0].password) {
            const jwtPayload = {
                userId: res.locals.userId,
                userAccount: req.body.account
            }
            const jwtSignOptions = {
                algorithm: 'HS256',
                issuer: jwt.getIssuer(),
                expiresIn: jwt.getExpire()
            }
            const token = await jwt.createAccessToken(jwtPayload, jwt.getSecretKey(), jwtSignOptions);
            const user = {
                [token]: token
            }
            await redisClient.hset('user-jwt', user);
            return token;
        } else {
            logger.error('Throw custom error within services/login: Password is not matched');
            throw new Error('Password is not matched');
        }
    } catch (err) {
        throw err;
    }
}

module.exports = {
    login
}
