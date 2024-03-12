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
        logger.info('Check db connection is alive');
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

async function exec(sqlQuery, params) {
    try {
        const start = Date.now();
        const res = await pool.query(sqlQuery, params);
        const end = Date.now();
        const duration = end-start;
        logger.debug(`Execute SQL query: ${sqlQuery}, Value: ${params}, Duration: ${duration}ms`);
        return res;
    } catch (err) {
        logger.error(`Execute SQL query error: ${err}`);
    }
}

module.exports = {
    pool,
    isConnected,
    exec
}
