const path = require('path');
const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authenticator');
const registryService = require('../services/registry');

router.get('/', (req, res) => {
    logger.debug('Get registry page');
    res.sendFile(path.join(__dirname, '../views/registry.html'));
});

router.post('/', authMiddleware.verifyAccountExist, async (req, res) => {
    try {
        logger.debug(`Register a new user ${req.body.account}`);
        const result = await registryService.register(req, res);
        if(result) {
            res.status(201).send(result);
        }
    } catch (err) {
        logger.error(`Error caught in routes/registry: ${err}`);
        res.status(409).send('Account already exists');
    }
});

module.exports = router;
