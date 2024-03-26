const logger = require('../../../utils/logger');
const express = require('express');
const router = express.Router();
const articleService = require('../../../services/articles');

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
