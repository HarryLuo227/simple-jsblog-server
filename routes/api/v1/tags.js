const logger = require('../../../utils/logger');
const express = require('express');
const router = express.Router();
const tagService = require('../../../services/tags');

/**
 * @swagger
 * components:
 *   TagsModel:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         default: 1
 *       name:
 *         type: string
 *         default: test
 *       created_at:
 *         type: string
 *         format: date-time
 *       modified_at:
 *         type: string
 *         format: date-time
 *   ErrorResponse:
 *     type: object
 *     properties:
 *       ErrorMsg:
 *         type: string
 */

/**
 * @swagger
 * /api/v1/tags:
 *   get:
 *     description: List all tags
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 */
router.get('/', async (req, res) => {
    try {
        logger.debug('Get all tags');
        const result = await tagService.list(req, res);
        if(result) {
            res.status(200).json(result);
        }
    } catch (err) {
        logger.error(`Error caught in routes/tags: ${err}`);
    }
});

/**
 * @swagger
 * /api/v1/tags:
 *   post:
 *     description: Create a new tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 default: test-post
 *     responses:
 *       201:
 *         description: Create success and Return the tag object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/TagsModel'
 *       409:
 *         description: Create failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
router.post('/', async (req, res) => {
    try {
        logger.debug('Create a new tag');
        const result = await tagService.create(req, res);
        if(result) {
            res.status(201).json(result);
        }
    } catch (err) {
        logger.error(`Error caught in routes/tags: ${err}`);
        res.status(409).json({ ErrorMsg: 'Tag already exists' });
    }
});

/**
 * @swagger
 * /api/v1/tags/{tagId}:
 *   get:
 *     description: Get tag details by tag id
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *     responses:
 *       200:
 *         description: Success and Return the tag object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/TagsModel'
 *       404:
 *         description: Failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
router.get('/:id', async (req, res) => {
    try {
        logger.debug('Get tag details by tag id');
        const result = await tagService.get(req, res);
        if(result) {
            res.status(200).json(result);
        } else {
            logger.error('Throw custom error within routes/api/v1/tags: ID Not Found');
            throw new Error('ID Not Found');
        }
    } catch (err) {
        logger.error(`Error caught in routes/tags: ${err}`);
        res.status(404).json({ ErrorMsg: err.message })
    }
});

/**
 * @swagger
 * /api/v1/tags/{tagId}:
 *   put:
 *     description: Update tag details by tag id
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update success and Return the updated tag object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/TagsModel'
 *       404:
 *         description: Update failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
router.put('/:id', async (req, res) => {
    try {
        logger.debug('Update tag details by tag id');
        const result = await tagService.update(req, res);
        res.status(200).json(result);
    } catch (err) {
        logger.error(`Error caught in routes/tags: ${err}`);
        res.status(404).json({ ErrorMsg: err.message });
    }
});

/**
 * @swagger
 * /api/v1/tags/{tagId}:
 *   delete:
 *     description: Delete tag by tag id
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *     responses:
 *       204:
 *         description: Delete success and Return nothing
 *       404:
 *         description: Delete failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 *       500:
 *         description: Delete failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
router.delete('/:id', async (req, res) => {
    try {
        logger.debug('Delete tag by tag id');
        await tagService.remove(req, res);
        res.status(204).end();
    } catch (err) {
        logger.error(`Error caught in routes/tags: ${err}`);
        switch(err.message) {
            case 'No resource':
                res.status(404).json({ ErrorMsg: err.message });
                break;
            default:
                res.status(500).json({ ErrorMsg: err.message });
                break;
        }
    }
});

module.exports = router;
