const logger = require('../../../utils/logger');
const express = require('express');
const router = express.Router();
const articleService = require('../../../services/articles');

/**
 * @swagger
 * components:
 *   ArticlesWithTagsModel:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         default: 1
 *       title:
 *         type: string
 *         default: test-article
 *       description:
 *         type: string
 *         default:
 *       content:
 *         type: string
 *         default: Contents of the test article
 *       created_at:
 *         type: string
 *         format: date-time
 *       created_by:
 *         type: string
 *         default: tester
 *       modified_at:
 *         type: string
 *         format: date-time
 *       tagsId:
 *         type: array
 *         default: [1, 2, 3]
 */

/**
 * @swagger
 * /api/v1/articles:
 *   get:
 *     description: List all articles with their corresponding tags name
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.get('/', async (req, res) => {
    try {
        logger.debug('Get all articles with their corresponding tags name');
        const result = await articleService.list(req, res);
        if(result) {
            res.status(200).json(result);
        }
    } catch (err) {
        logger.error(`Error caught in routes/articles: ${err}`);
        res.status(500).json({ ErrorMsg: err.message });
    }
});

/**
 * @swagger
 * /api/v1/articles:
 *   post:
 *     description: Create a new article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 default: test-article
 *               description:
 *                 type: string
 *                 default:
 *               content:
 *                 type: string
 *                 default: Contents of the test article
 *               createdBy:
 *                 type: integer
 *                 default: 1
 *               tagsId:
 *                 type: array
 *                 default: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Create success and Return the object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ArticlesWithTagsModel'
 *       404:
 *         description: Create failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 *       500:
 *         description: Create failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
router.post('/', async (req, res) => {
    try {
        logger.debug('Create a new article');
        const result = await articleService.create(req, res);
        if(result) {
            res.status(201).json(result);
        }
    } catch (err) {
        logger.error(`Error caught in routes/articles: ${err}`);
        switch(err.message) {
            case 'Tag ID must be required':
                res.status(404).json({ ErrorMsg: err.message });
                break;
            case 'Unexpected error happened in create article':
                res.status(500).json({ ErrorMsg: err.message });
                break;
            case 'Unexpected error happened in create articles_tags':
                res.status(500).json({ ErrorMsg: err.message });
                break;
            default:
                res.status(500).json({ ErrorMsg: err.message });
                break;
        }
    }
});

/**
 * @swagger
 * /api/v1/tags/{articleId}:
 *   get:
 *     description: Get article details by article id
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *     responses:
 *       200:
 *         description: Success and Return the json object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ArticlesWithTagsModel'
 *       500:
 *         description: Failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
router.get('/:id', async (req, res) => {
    try {
        logger.debug('Get article details by article id');
        const result = await articleService.get(req, res);
        if(result) {
            res.status(200).json(result);
        }
    } catch (err) {
        logger.error(`Error caught in routes/articles: ${err}`);
        res.status(500).json({ ErrorMsg: err.message });
    }
});

/**
 * @swagger
 * /api/v1/articles/{articleId}:
 *   put:
 *     description: Update article details by article id
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 default: test-article
 *               description:
 *                 type: string
 *                 default:
 *               content:
 *                 type: string
 *                 default: Contents of the test article
 *               tagsId:
 *                 type: array
 *                 default: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Update success and Return the updated json object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ArticlesWithTagsModel'
 *       400:
 *         description: Update failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 *       500:
 *         description: Update failure and Return json object with error message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/ErrorResponse'
 */
router.put('/:id', async (req, res) => {
    try {
        logger.debug('Update article details by article id');
        const result = await articleService.update(req, res);
        if(result) {
            res.status(200).json(result);
        }
    } catch (err) {
        logger.error(`Error caught in routes/articles: ${err}`);
        switch(err.message) {
            case 'Title cannot be empty string':
            case 'Tag ID must required':
                res.status(400).json({ ErrorMsg: err.message });
                break;
            
            default:
                res.status(500).json({ ErrorMsg: err.message });
                break;
        }
    }
});

/**
 * @swagger
 * /api/v1/articles/{articleId}:
 *   delete:
 *     description: Delete article by article id
 *     parameters:
 *       - in: path
 *         name: articleId
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
        logger.debug('Delete article by article id');
        await articleService.remove(req, res);
        res.status(204).end();
    } catch (err) {
        logger.error(`Error caught in routes/articles: ${err}`);
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
