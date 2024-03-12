const path = require('path');
const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authenticator');
const loginService = require('../services/login');

router.get('/', (req, res) => {
    logger.debug('Get login page');
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.post('/', authMiddleware.verifyAccountExist, async (req, res) => {
    try {
        logger.debug(`User ${req.body.account} login`);
        const result = await loginService.login(req, res);
        if(result) {
            res.status(200).send(result);
        }
    } catch (err) {
        logger.error(`Error caught in routes/login: ${err}`);
        res.status(401).send('Unauthorized');
    }
});

module.exports = router;
