const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    logger.info('Redirect to registry page');
    res.status(200).send('API is not implemented');
});

router.post('/', (req, res) => {
    logger.info('Register a new user');
    logger.debug(`Account: ${req.body.account}, Password: ${req.body.password}`);
    res.status(201).send('API is not implemented');
});

module.exports = router;
