const express = require('express');
const router = express.Router();
const usersRouter = require('./api/v1/users');
const tagsRouter = require('./api/v1/tags');
const articlesRouter = require('./api/v1/articles');

router.use('/users', usersRouter);
router.use('/tags', tagsRouter);
router.use('/articles', articlesRouter);

module.exports = router;
