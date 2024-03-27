const request = require('supertest');
const { server } = require('../app');
const db = require('../db/index');

afterEach(async () => {
    if(server) {
        server.close();
    }
});

// For HTTP POST request use
const succeed201Payload = {
    title: 'testing-post-article',
    description: '',
    content: 'This is a temp article of unit test of the create article api.',
    createdBy: 1,
    tagsId: [1, 2, 3, 4]
}
const fail404Payload = {
    title: 'testing-post-article-failure',
    description: '',
    content: 'This is a temp article of unit test of the create article api, return 404 failure.',
    createdBy: 1,
    tagsId: []
}
const postRequestPayloads = {
    Succeed201: succeed201Payload,
    Fail404: fail404Payload,
    Fail500InArticles: succeed201Payload,
}

// For HTTP PUT request use
const succeed200Payload = {
    title: 'testing-put-article',
    description: 'Update from testing-post-article to testing-put-article',
    content: 'This is a temp article of unit test of the update article api.',
    tagsId: [1, 3]
}
const fail400InTitlePayload = {
    title: '',
    description: 'Update from testing-post-article to testing-put-article',
    content: 'This is a temp article of unit test of the update article api.',
    tagsId: [1, 3]
}
const fail400InTagIdPayload = {
    title: 'testing-put-article',
    description: 'Update from testing-post-article to testing-put-article',
    content: 'This is a temp article of unit test of the update article api.',
    tagsId: []
}
const putRequestPayloads = {
    Succeed200: succeed200Payload,
    Fail400InTitle: fail400InTitlePayload,
    Fail400InTagId: fail400InTagIdPayload
}

describe('GET /api/v1/articles', () => {
    it('should 200 success and return json objects(include empty)', async () => {
        await request(server)
            .get('/api/v1/articles')
            .type('application/json')
            .expect(200);
    });
});

// TODO: Not implement error insert multiple articles_tags rows testing 
describe('POST /api/v1/articles', () => {
    it('should 201 success and return the created object', async () => {
        const res = await request(server)
            .post('/api/v1/articles')
            .send(postRequestPayloads.Succeed201)
            .expect(201);

        const expectedTagIDs = [];
        for(let i = 0; i < res.body.ArticlesTags.length; i++) {
            expectedTagIDs.push(res.body.ArticlesTags[i].tags_id);
        }

        expect(res.body.Articles.title).toEqual(postRequestPayloads.Succeed201.title);
        expect(res.body.Articles.description).toEqual(postRequestPayloads.Succeed201.description);
        expect(res.body.Articles.content).toEqual(postRequestPayloads.Succeed201.content);
        expect(expectedTagIDs).toEqual(postRequestPayloads.Succeed201.tagsId);
    });

    it('should 404 failure and return json object with error message', async () => {
        const expectedResponse = {
            ErrorMsg: 'Tag ID must be required'
        }

        const res = await request(server)
            .post('/api/v1/articles')
            .send(postRequestPayloads.Fail404)
            .expect(404);

        expect(res.body).toEqual(expectedResponse);
    });

    it('should 500 failure and return json object with error message', async () => {
        const expectedResponse = {
            ErrorMsg: 'Unexpected error happened in create article'
        }

        const res = await request(server)
            .post('/api/v1/articles')
            .send(postRequestPayloads.Fail500InArticles)
            .expect(500);

        expect(res.body).toEqual(expectedResponse);
    });
});

describe('GET /api/v1/articles/:articleId', () => {
    it('should 200 success and return json object', async () => {
        const articleId = await getArticleIdByTitleAndCreatedBy(postRequestPayloads.Succeed201.title, postRequestPayloads.Succeed201.createdBy);
        const endpoint = `/api/v1/articles/${articleId}`;
        const res = await request(server)
            .get(endpoint)
            .expect(200);

        expect(res.body.id).toBe(articleId);
    });
});

describe('PUT /api/v1/articles/:articleId', () => {
    it('should 200 success and return updated json object', async () => {
        const articleId = await getArticleIdByTitleAndCreatedBy(postRequestPayloads.Succeed201.title, postRequestPayloads.Succeed201.createdBy);
        const endpoint = `/api/v1/articles/${articleId}`;
        const res = await request(server)
            .put(endpoint)
            .send(putRequestPayloads.Succeed200)
            .expect(200);

        const expectedTagIDs = [];
        for(let i = 0; i < res.body.ArticlesTags.length; i++) {
            expectedTagIDs.push(res.body.ArticlesTags[i].tags_id);
        }
        expect(res.body.Articles.title).toEqual(putRequestPayloads.Succeed200.title);
        expect(res.body.Articles.description).toEqual(putRequestPayloads.Succeed200.description);
        expect(res.body.Articles.content).toEqual(putRequestPayloads.Succeed200.content);
        expect(expectedTagIDs).toEqual(putRequestPayloads.Succeed200.tagsId);
    });

    it('should 400 failure and return json object with error message', async () => {
        const expectedResponse = {
            ErrorMsg: 'Title cannot be empty string'
        }
        
        const articleId = await getArticleIdByTitleAndCreatedBy(putRequestPayloads.Succeed200.title, postRequestPayloads.Succeed201.createdBy);
        const endpoint = `/api/v1/articles/${articleId}`;
        const res = await request(server)
            .put(endpoint)
            .send(putRequestPayloads.Fail400InTitle)
            .expect(400);

        expect(res.body).toEqual(expectedResponse);
    });

    it('should 400 failure and return json object with error message', async () => {
        const expectedResponse = {
            ErrorMsg: 'Tag ID must required'
        }
        
        const articleId = await getArticleIdByTitleAndCreatedBy(putRequestPayloads.Succeed200.title, postRequestPayloads.Succeed201.createdBy);
        const endpoint = `/api/v1/articles/${articleId}`;
        const res = await request(server)
            .put(endpoint)
            .send(putRequestPayloads.Fail400InTagId)
            .expect(400);

        expect(res.body).toEqual(expectedResponse);
    });
});

describe('DELETE /api/v1/articles/:articleId', () => {
    it('should 204 success and return nothing', async () => {
        const articleId = await getArticleIdByTitleAndCreatedBy(putRequestPayloads.Succeed200.title, postRequestPayloads.Succeed201.createdBy);
        const endpoint = `/api/v1/articles/${articleId}`;
        await request(server)
            .delete(endpoint)
            .expect(204);
    });

    it('should 404 failure and return json object with error message', async () => {
        const expectedResponse = {
            ErrorMsg: 'No resource'
        }
        
        const articleId = 1000;
        const endpoint = `/api/v1/articles/${articleId}`;
        const res = await request(server)
            .delete(endpoint)
            .expect(404);

        expect(res.body).toEqual(expectedResponse);
    });

    it('should 500 failure and return json object with error message', async () => {
        const articleId = 'somestring';
        const endpoint = `/api/v1/articles/${articleId}`;
        const res = await request(server)
            .delete(endpoint)
            .expect(500);
    });
});

/**
 * Get the test article data id for DELETE test use
 * @param {string} articleTitle 
 * @param {int} articleCreatedBy 
 * @returns {int}
 */
async function getArticleIdByTitleAndCreatedBy(articleTitle, articleCreatedBy) {
    const result = await db.exec('SELECT id FROM articles WHERE title = $1 AND created_by = $2', [articleTitle, articleCreatedBy]);
    return result.rows[0].id;
}
