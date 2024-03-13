const Config = require('../configs/config');
const jwt = require('jsonwebtoken');
const logger = require('./logger');

function getIssuer() {
    return Config.JwtIssuer;
}

function getExpire() {
    return Config.JwtExpire;
}

function getSecretKey() {
    return Config.JwtSecret;
}

async function createAccessToken(payload, secretKey, signOptions) {
    try {
        logger.debug('Generate JWT token');
        const token = await jwt.sign(payload, secretKey, signOptions);
        return token;
    } catch (err) {
        logger.error(`Error in generating JWT token: ${err}`);
    }
}

module.exports = {
    getIssuer,
    getExpire,
    getSecretKey,
    createAccessToken
}
