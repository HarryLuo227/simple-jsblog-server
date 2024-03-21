const express = require('express');
const router = express.Router();
const usersRouter = require('./api/v1/users');
const tagsRouter = require('./api/v1/tags');

router.use('/users', usersRouter);
router.use('/tags', tagsRouter);

module.exports = router;
