const logger = require('../utils/logger');
const path = require('path');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authenticator');
const loginService = require('../services/login');

/**
 * @swagger
 * /login:
 *   get:
 *     description: Return login page
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
router.get('/', (req, res) => {
    logger.debug('Get login page');
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

/**
 * @swagger
 * /login:
 *   post:
 *     description: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account
 *               - password
 *             properties:
 *               account:
 *                 type: string
 *                 default: test@example.com
 *               password:
 *                 type: string
 *                 default: 123456
 *     responses:
 *       200:
 *         description: Login success and Return json web token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   default: xxxxxxxxxx.yyyyyyyyyy.zzzzzzzzzz
 *       401:
 *         description: Login fail
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               default: Unauthenticated
 */
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
        res.status(401).json('Unauthenticated');
    }
});

module.exports = router;
