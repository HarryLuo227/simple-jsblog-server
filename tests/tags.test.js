const request = require('supertest');
const { server } = require('../app');
const db = require('../db/index');

afterEach(async () => {
    if(server) {
        server.close();
    }
});

// For POST request test
const postRequestPayload = {
    name: 'test-post'
}
// For PUT and DELETE request test
const updatedName = 'test-delete'
const putRequestPayload = {
    name: updatedName
}

describe('GET /api/v1/tags', () => {
    it('should 200 success and return json(include empty)', async () => {
        await request(server)
            .get('/api/v1/tags')
            .type('application/json')
            .expect(200);
    });
});

describe('POST /api/v1/tags', () => {
    it('should 201 success and return the created object', async () => {
        const res = await request(server)
            .post('/api/v1/tags')
            .type('application/x-www-form-urlencoded')
            .send(postRequestPayload)
            .expect(201);

        expect(res.body.name).toBe(postRequestPayload.name);
    });

    it('should 409 fail and return json object with error message', async () => {
        const expectedResponse = {
            ErrorMsg: 'Tag already exists'
        }

        const res = await request(server)
            .post('/api/v1/tags')
            .type('application/x-www-form-urlencoded')
            .send(postRequestPayload)
            .expect(409);

        expect(res.body).toEqual(expectedResponse);
    });
});

describe('GET /api/v1/tags/:id', () => {
    it('should 200 success and return the json object', async () => {
        const tagId = 1;
        const endpoint = `/api/v1/tags/${tagId}`;
        const res = await request(server)
            .get(endpoint)
            .expect(200);

        expect(res.body.id).toBe(1);
        expect(res.body.name).toBe('test');
    });

    it('should 404 fail and return json object with error message', async () => {
        const expectedResponse = {
            ErrorMsg: 'ID Not Found'
        }
        
        const tagId = 1000;
        const endpoint = `/api/v1/tags/${tagId}`;
        const res = await request(server)
            .get(endpoint)
            .expect(404);

        expect(res.body).toEqual(expectedResponse);
    });
});

describe('PUT /api/v1/tags/:id', () => {
    it('should 200 success and return updated json object', async () => {
        const expectedId = await getTagIdByName(postRequestPayload.name);

        const tagId = expectedId;
        const endpoint = `/api/v1/tags/${tagId}`;
        const res = await request(server)
            .put(endpoint)
            .send(putRequestPayload)
            .expect(200);

        expect(res.body.id).toEqual(expectedId);
        expect(res.body.name).toEqual(updatedName);
    });

    it('should 404 failure and return json object with error message', async () => {
        const expectedResponse = {
            ErrorMsg: 'Unexpected error happened'
        }
        
        const tagId = 1000;
        const endpoint = `/api/v1/tags/${tagId}`;
        const res = await request(server)
            .put(endpoint)
            .send(putRequestPayload)
            .expect(404);

        expect(res.body).toEqual(expectedResponse);
    });
});

describe('DELETE /api/v1/tags/:id', () => {
    it('should 204 success and return nothing', async () => {
        const tagId = await getTagIdByName(putRequestPayload.name);
        const endpoint = `/api/v1/tags/${tagId}`;
        await request(server)
            .delete(endpoint)
            .expect(204);
    });

    it('should 404 failure and return json object with error message', async () => {
        const expectedResponse = {
            ErrorMsg: 'No resource'
        }

        const tagId = 1000;
        const endpoint = `/api/v1/tags/${tagId}`;
        const res = await request(server)
            .delete(endpoint)
            .expect(404);

        expect(res.body).toEqual(expectedResponse);
    });

    it('should 500 failure and return json object with error message', async () => {
        const expectedResponse = {
            ErrorMsg: 'Unexpected error happened'
        }
        
        const tagId = 'somestring';
        const endpoint = `/api/v1/tags/${tagId}`;
        const res = await request(server)
            .delete(endpoint)
            .expect(500);

        expect(res.body).toEqual(expectedResponse);
    });
});

/**
 * Get the test tag data id for DELETE test use
 * @param {string} tagName 
 * @returns {int}
 */
async function getTagIdByName(tagName) {
    const result = await db.exec('SELECT id FROM tags WHERE name = $1', [tagName]);
    return result.rows[0].id;
}
