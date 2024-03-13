const logger = require('../utils/logger');
const path = require('path');
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
        const result = await loginService.login(req, res);
        if(result) {
            res.status(200).json({ 'token': result });
        } else {
            throw new Error('Unexpected error occurred: token is empty');
        }
    } catch (err) {
        logger.error(`Error caught in routes/login: ${err}`);
        res.status(401).send('Unauthenticated');
    }
});

module.exports = router;
