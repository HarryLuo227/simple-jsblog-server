const db = require('../db/index');
const logger = require('../utils/logger');
const articletagService = require('./articles_tags');
const utils = require('../utils/service');

/**
 * Get all articles with their corresponding tags name from table
 */
async function list(req, res) {
    try {
        const sql = 'SELECT a.id, a.title, a.description, a.content, a.created_at, a.modified_at, array_agg(at.tags_id) AS tags_id, u.fullname FROM articles AS a INNER JOIN articles_tags AS at ON a.id = at.articles_id INNER JOIN users AS u ON a.created_by = u.id GROUP BY a.id, u.fullname';
        const result = await db.exec(sql);
        if(result.rows.length >= 0) {
            switch(result.rows.length) {
                case 0:
                    const noRecords = {}
                    return noRecords;
                default:
                    return result.rows;
            }
        } else {
            logger.error('Throw custom error within services/articles: Unexpected error happened');
            throw new Error('Unexpected error happened');
        }
    } catch (err) {
        throw err;
    }
}

/**
 * Insert an article into table
 */
async function create(req, res) {
    const client = await db.pool.connect();
    let createArticleResult;
    const articlesTagsResult = [];
    
    try {
        logger.debug('Start transaction');
        await client.query('BEGIN');

        // TagsID cannot be NULL
        if(req.body.tagsId.length === 0) {
            logger.error('Throw custom error within services/articles: Tag ID must be required');
            throw new Error('Tag ID must be required');
        }

        // Create article
        const createArticleSql = 'INSERT INTO articles(title, description, content, created_at, created_by, modified_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const currentTime = new Date();
        const createArticleValues = [
            req.body.title,
            req.body.description,
            req.body.content,
            currentTime,
            req.body.createdBy,
            currentTime
        ];
        createArticleResult = await client.query(createArticleSql, createArticleValues);
        
        // Create articles_tags
        const createArticlesTagsSql = 'INSERT INTO articles_tags(articles_id, tags_id, created_at, modified_at) VALUES($1, $2, $3, $4) RETURNING *';
        for(let i = 0; i < req.body.tagsId.length; i++) {
            const createArticlesTagsValues = [
                createArticleResult.rows[0].id,
                req.body.tagsId[i],
                currentTime,
                currentTime,
            ]
            const createArticlesTagsResult = await client.query(createArticlesTagsSql, createArticlesTagsValues);
            articlesTagsResult.push(createArticlesTagsResult.rows[0]);
        }

        logger.debug('Transaction succeeded');
        await client.query('COMMIT');

        return {
            Articles: createArticleResult.rows[0],
            ArticlesTags: articlesTagsResult
        }
    } catch (err) {
        logger.debug('Transaction failed and rollback');
        await client.query('ROLLBACK');

        if(err.message === 'Tag ID must be required') {
            throw err;
        } else if(!createArticleResult) {
            logger.error('Throw custom error within services/articles: Unexpected error happened in create article');
            logger.error(err);
            throw new Error('Unexpected error happened in create article');
        } else if(articlesTagsResult.length !== req.body.tagsId.length) {
            logger.error('Throw custom error within services/articles: Unexpected error happened in create articles_tags');
            logger.error(err);
            throw new Error('Unexpected error happened in create articles_tags');
        } else {
            throw err;
        }
    } finally {
        client.release();
        logger.debug('Close transaction');
    }
}

/**
 * Get an article by id
 */
async function get(req, res) {
    try {
        const sql = 'SELECT a.id, a.title, a.description, a.content, a.created_at, a.modified_at, array_agg(at.tags_id) AS tags_id, u.fullname FROM articles AS a INNER JOIN articles_tags AS at ON a.id = at.articles_id INNER JOIN users AS u ON a.created_by = u.id WHERE a.id = $1 GROUP BY a.id, u.fullname';
        const values = [req.params.id];
        const result = await db.exec(sql, values);
        if(result) {
            return result.rows[0];
        } else {
            logger.error('Throw custom error within services/articles: Unexpected error happened');
            throw new Error('Unexpected error happened');
        }
    } catch (err) {
        throw err;
    }
}

// Update article by id
async function update(req, res) {
    const client = await db.pool.connect();
    res.locals.client = client;

    try {
        logger.debug('Start transaction');
        await client.query('BEGIN');

        if(req.body.title === '') {
            logger.error('Throw custom error within services/articles: Title cannot be empty string');
            throw new Error('Title cannot be empty string');
        }
        if(req.body.tagsId && req.body.tagsId.length === 0) {
            logger.error('Throw custom error within services/articles: Tag ID must required');
            throw new Error('Tag ID must required');
        }

        // Update articles
        const updatedBody = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
        }
        const subSql = utils.objToSQLUpdateQueryString(updatedBody);
        const sql = `UPDATE articles SET ${subSql} WHERE id = \$${Object.keys(updatedBody).length + 1} RETURNING *`;
        const values = [
            req.body.title,
            req.body.description,
            req.body.content,
            req.params.id
        ];
        const updateArticleResult = await client.query(sql, values);
        if(updateArticleResult.rows.length === 0) {
            logger.error('Throw custom error within services/articles: Unexpected error happened');
            throw new Error('Unexpected error happened');
        }

        // Update articles_tags
        const articleTagsResult = await articletagService.update(req, res);

        logger.debug('Transaction succeeded');
        await client.query('COMMIT');

        return {
            Articles: updateArticleResult.rows[0],
            ArticlesTags: articleTagsResult
        }
    } catch (err) {
        logger.error('Transaction failed and rollback');
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
        logger.debug('Close transaction');
    }
}

/**
 * Delete article by id
 */
async function remove(req, res) {
    const client = await db.pool.connect();
    
    try {
        logger.debug('Start transaction');
        await client.query('BEGIN');

        const values = [req.params.id];
        // Delete articles_tags
        const deleteArticlesTagsSql = 'DELETE FROM articles_tags WHERE articles_id = $1'
        const deleteArticlesTagsResult = await client.query(deleteArticlesTagsSql, values);
        switch(deleteArticlesTagsResult.rowCount) {
            case 0:
                logger.error('Throw custom error within services/articles: No articles_tags resource');
                throw new Error('No resource');
            default:
                break;
        }

        // Delete article
        const deleteArticleSql = 'DELETE FROM articles WHERE id = $1';
        const deleteArticleResult = await client.query(deleteArticleSql, values);
        switch(deleteArticleResult.rowCount) {
            case 0:
                logger.error('Throw custom error within services/articles: No articles resource');
                throw new Error('No resource');
            case 1:
                break;
            default:
                logger.error('Throw custom error within services/articles: Unexpected error happened in delete article');
                throw new Error('Unexpected error happened in delete article');
        }

        logger.debug('Transaction succeeded');
        await client.query('COMMIT');
        return
    } catch (err) {
        logger.error('Transaction failed and rollback');
        await client.query('ROLLBACK');

        if(err.message === 'No resource') {
            throw err;
        }

        logger.error('Throw custom error within services/tags: Unexpected error happened');
        logger.error(`Error details: ${err}`);
        throw new Error('Unexpected error happened');
    } finally {
        client.release();
        logger.debug('Close transaction');
    }
}

module.exports = {
    list,
    create,
    get,
    update,
    remove
}
