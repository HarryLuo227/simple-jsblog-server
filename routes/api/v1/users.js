const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('[Debug] List all users');
    res.send('API is not implemented');
});

router.get('/:id', (req, res) => {
    console.log(`[Debug] Get user information by user\' id ${req.params.id}`);
    res.send('API is not implemented');
});

router.put('/:id', (req, res) => {
    console.log(`[Debug] Update user information by user\' id ${req.params.id}`);
    res.send('API is not implemented');
});

router.delete('/:id', (req, res) => {
    console.log(`[Debug] Delete user by user\'s id ${req.params.id}`);
    res.send('API is not implemented');
});

module.exports = router;
