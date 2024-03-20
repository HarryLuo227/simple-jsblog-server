const logger = require('../../../utils/logger');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * components:
 *   UserModel:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         default: 1
 *       fullname:
 *         type: string
 *         default: tester
 *       account:
 *         type: string
 *         default: test@example.com
 *       password:
 *         type: string
 *         default: 123456
 *       birth:
 *         type: string
 *         format: date
 *         default: 2000-01-01
 *       created_at:
 *         type: string
 *         format: date-time
 *       modified_at:
 *         type: string
 *         format: date-time
 */


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
