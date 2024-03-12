const logger = require('../utils/logger');
const db = require('../db/index');

async function login(req, res) {
    try {
        const sql = 'SELECT * FROM users WHERE id = $1';
        const values = [res.locals.userId];
        const result = await db.exec(sql, values);
        if(result.rows[0].account === req.body.account && result.rows[0].password === req.body.password) {
            return result.rows[0];
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
