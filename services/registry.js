const logger = require('../utils/logger');
const db = require('../db/index');

async function register(req, res) {
    try {
        const sql = 'INSERT INTO users(fullname, account, password, birth, created_at, modified_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const currentTime = new Date();
        const values = [
            req.body.fullname,
            req.body.account,
            req.body.password,
            req.body.birth,
            currentTime,
            currentTime
        ];
        const result = await db.exec(sql, values);
        if(result.rows.length !== 0) {
            return result.rows[0];
        } else {
            logger.error('Throw custom error within services/registry: Unexpected error happened');
            throw new Error('Unexpected error happened');
        }
    } catch (err) {
        throw err;
    }
}

module.exports = {
    register
}
