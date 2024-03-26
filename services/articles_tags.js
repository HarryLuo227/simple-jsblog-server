const logger = require('../utils/logger');
const db = require('../db/index');

/**
 * Update tags of articles_tags
 */
async function update(req, res) {
    let client;
    if(res.locals.client) {
        client = res.locals.client;
    } else {
        client = await db.pool.connect();
    }

    try {
        // Delete origin tags of articles
        const deleteOriginTagsSql = 'DELETE FROM articles_tags WHERE articles_id = $1';
        const deleteOriginTagsResult = await client.query(deleteOriginTagsSql, [req.params.id]);
        switch(deleteOriginTagsResult.rowCount) {
            case 0:
                logger.error('Throw custom error within services/articles_tags: Delete origin tags failed');
                throw new Error('Delete origin tags failed');
            default:
                break;
        }

        // Create articles_tags
        const articlesTagsResult = [];
        const createArticlesTagsSql = 'INSERT INTO articles_tags(articles_id, tags_id, created_at, modified_at) VALUES($1, $2, $3, $4) RETURNING *';
        const currentTime = new Date();
        for(let i = 0; i < req.body.tagsId.length; i++) {
            const createArticlesTagsValues = [
                req.params.id,
                req.body.tagsId[i],
                currentTime,
                currentTime,
            ]
            const createArticlesTagsResult = await client.query(createArticlesTagsSql, createArticlesTagsValues);
            articlesTagsResult.push(createArticlesTagsResult.rows[0]);
        }
        
        return articlesTagsResult;
    } catch (err) {
        if(articlesTagsResult.length !== req.body.tagId.length) {
            logger.error('Throw custom error within services/articles_tags: Insert updated tags failed');
            logger.error(err);
            throw new Error('Insert updated tags failed');
        }
        throw err;
    } finally {
        if(!res.locals.client) {
            client.release();
        }
    }
}

module.exports = {
    update
}
