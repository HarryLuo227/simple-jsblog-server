const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('[Info] Redirect to registry page');
    res.status(200).send('API is not implemented');
});

router.post('/', (req, res) => {
    console.log('[Info] Register a new user');
    console.log(`[Debug] Account: ${req.body.account}, Password: ${req.body.password}`);
    res.status(201).send('API is not implemented');
});

module.exports = router;
