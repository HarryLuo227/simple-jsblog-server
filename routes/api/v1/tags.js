const logger = require('../../../utils/logger');
const express = require('express');
const router = express.Router();
const tagService = require('../../../services/tags');

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
