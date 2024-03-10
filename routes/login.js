const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    logger.info('Redirect to login page');
    res.status(200).send('API is not implemented');
});

router.post('/', (req, res) => {
    logger.info('User login');
    logger.debug(`User account: ${req.body.account}, password: ${req.body.password}`);
    res.status(200).send('API is not implemented');
});

module.exports = router;
