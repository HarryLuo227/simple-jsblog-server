const Config = require('../configs/config');
const logger = require('../utils/logger');
const Redis = require('ioredis');

const url = CreateConnectionUrl(Config);
const redisClient = new Redis(url);

function CreateConnectionUrl(config) {
    let connectionString = "";
    if(config.RedisUser === "" && config.RedisPassword === "") {
        connectionString = `redis://${config.RedisAddr}:${config.RedisPort}`;
    } else {
        connectionString = `redis://${config.RedisUser}:${config.RedisPassword}@${config.RedisAddr}:${config.RedisPort}`;
    }

    return connectionString;
}

async function isConnected() {
    try {
        logger.info('Check redis connection is alive');
        let isAlive = false;
        logger.debug('Ping to redis');
        const response = redisClient.once('ready', async () => {
            return await redisClient.ping();
        });
        if(response) {
            logger.debug('Get pong from redis');
            isAlive = true;
        }
        return isAlive;
    } catch (err) {
        logger.error(`Error occurred: ${err}`);
    }   
}

module.exports = {
    redisClient,
    isConnected
}
