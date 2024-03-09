const Config = require('../configs/config');
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
        console.log('[Debug] Check db connection is alive');
        let isAlive = false;
        console.log('[Debug] Create a connected client');
        const client = await pool.connect();
        const result = client.query('SELECT NOW()');
        if(result) {
            isAlive = true;
            console.log('[Debug] Release connected client');
            client.release();
            return isAlive;
        }
        return isAlive;
    } catch (err) {
        console.log(`[Error] Error occurred: ${err}`);
    }
}

module.exports = {
    pool,
    isConnected
}
