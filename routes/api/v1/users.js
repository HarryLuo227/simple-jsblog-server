const logger = require('../../../utils/logger');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    logger.debug('List all users');
    res.send('API is not implemented');
});

router.get('/:id', (req, res) => {
    logger.debug(`Get user information by user\' id ${req.params.id}`);
    res.send('API is not implemented');
});

router.put('/:id', (req, res) => {
    logger.debug(`Update user information by user\' id ${req.params.id}`);
    res.send('API is not implemented');
});

router.delete('/:id', (req, res) => {
    logger.debug(`Delete user by user\'s id ${req.params.id}`);
    res.send('API is not implemented');
});

module.exports = router;
