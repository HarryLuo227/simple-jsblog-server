const path = require('path');
const logger = require('../utils/logger');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authenticator');
const registryService = require('../services/registry');

/**
 * @swagger
 * /registry:
 *   get:
 *     description: Return registry page
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get('/', (req, res) => {
    logger.debug('Get registry page');
    res.sendFile(path.join(__dirname, '../views/registry.html'));
});

/**
 * @swagger
 * /registry:
 *   post:
 *     description: Register new account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - account
 *               - password
 *               - birth
 *             properties:
 *               fullname:
 *                 type: string
 *                 default: tester
 *               account:
 *                 type: string
 *                 default: test@example.com
 *               password:
 *                 type: string
 *                 default: 123456
 *               birth:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Register success and Return json web token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/UserModel'
 *       409:
 *         description: Register fail, account already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               default: Account already exists
 */
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
