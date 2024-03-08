const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('[Info] Redirect to login page');
    res.status(200).send('API is not implemented');
});

router.post('/', (req, res) => {
    console.log('[Info] User login');
    console.log(`[Debug] User account: ${req.body.account}, password: ${req.body.password}`);
    res.status(200).send('API is not implemented');
});

module.exports = router;
