const logger = require('../utils/logger');
const db = require('../db/index');

async function verifyAccountExist(req, res, next) {
    try {
        logger.debug('Use verifyAccountExist middleware');

        const sql = 'SELECT id FROM users WHERE account = $1';
        console.log(req.body.account);
        const values = [req.body.account];
        const result = await db.exec(sql, values);

        if(req.baseUrl === '/login' && result.rows.length !== 0) {  // For user login
            res.locals.userId = result.rows[0].id;
            next();
        } else {    // For user registry
            if(result.rows.length !== 0) {
                logger.error(`Throw custom error within middlewares/authenticator: User ${req.body.account} already exists`);
                throw new Error(`User ${req.body.account} already exists`);
            }
            next();
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    verifyAccountExist
}
