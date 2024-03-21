const logger = require('../utils/logger');
const db = require('../db/index');
const utils = require('../utils/service')

// Get all tags from table
async function list(req, res) {
    try {
        const sql = 'SELECT * FROM tags';
        const result = await db.exec(sql);
        if(result.rows.length >= 0) {
            switch(result.rows) {
                case 0:
                    const noRecords = {}
                    return noRecords;
                default:
                    return result.rows;
            }
        } else {
            logger.error('Throw custom error within services/tags: Unexpected error happened');
            throw new Error('Unexpected error happened');
        }
    } catch (err) {
        throw err;
    }
}

// Insert a tag into table
async function create(req, res) {
    try {
        const sql = 'INSERT INTO tags(name, created_at, modified_at) VALUES($1, $2, $3) RETURNING *';
        const currentTime = new Date();
        const values = [
            req.body.name,
            currentTime,
            currentTime
        ];
        const result = await db.exec(sql, values);
        if(result) {
            return result.rows[0];
        } else {
            logger.error('Throw custom error within services/tags: Unexpected error happened');
            throw new Error('Unexpected error happened');
        }
    } catch (err) {
        throw err;
    }
}

// Get a tag by id
async function get(req, res) {
    try {
        const sql = 'SELECT * FROM tags WHERE id = $1';
        const values = [req.params.id];
        const result = await db.exec(sql, values);
        if(result) {
            return result.rows[0];
        } else {
            logger.error('Throw custom error within services/tags: Unexpected error happened');
            throw new Error('Unexpected error happened');
        }
    } catch (err) {
        throw err;
    }
}

// Update tag by id
async function update(req, res) {
    try {
        const subSql = utils.objToSQLUpdateQueryString(req.body);
        const sql = `UPDATE tags SET ${subSql} WHERE id = ${req.params.id} RETURNING *`;
        const values = [];
        Object.keys(req.body).forEach((key) => {
            values.push(req.body[key]);
        });
        const result = await db.exec(sql, values);
        if(result.rows.length === 1) {
            return result.rows[0];
        } else {
            logger.error('Throw custom error within services/tags: Unexpected error happened');
            throw new Error('Unexpected error happened');
        }
    } catch (err) {
        throw err;
    }
}

// Delete tag by id
async function remove(req, res) {
    try {
        const sql = 'DELETE FROM tags WHERE id = $1';
        const values = [req.params.id];
        const result = await db.exec(sql, values);
        switch(result.rowCount) {
            case 1:
                return;
            default:
                logger.error('Throw custom error within services/tags: No resource');
                throw new Error('No resource');
        }
    } catch (err) {
        if(err.message === 'No resource') {
            throw err;
        }

        logger.error('Throw custom error within services/tags: Unexpected error happened');
        logger.error(`Error details: ${err}`);
        throw new Error('Unexpected error happened');
    }
}

module.exports = {
    list,
    create,
    get,
    update,
    remove
}
