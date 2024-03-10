const Config = require('../configs/config');
const logger = require('../utils/logger');
const pg = require('pg');

const dbConfig = {
    user: Config.DBUser,
    password: Config.DBPassword,
    host: Config.DBAddr,
    port: Config.DBPort,
    database: Config.DBName
}
const pool = new pg.Pool(dbConfig);

async function isConnected() {
    try {
        logger.debug('Check db connection is alive');
        let isAlive = false;
        logger.debug('Create a connected client');
        const client = await pool.connect();
        const result = client.query('SELECT NOW()');
        if(result) {
            isAlive = true;
            logger.debug('Release connected client');
            client.release();
            return isAlive;
        }
        return isAlive;
    } catch (err) {
        logger.error(`Error occurred: ${err}`);
    }
}

module.exports = {
    pool,
    isConnected
}
