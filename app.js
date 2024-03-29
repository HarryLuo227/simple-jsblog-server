const Config = require('./configs/config');
const express = require('express');
const app = express();
const morgan = require('morgan');
const logger = require('./utils/logger');
const stream = {
    write: (msg) => logger.http(msg)
}
const skip = () => {
    return Config.RunMode !== 'debug';
}
const bodyParser = require('body-parser');
const registryRouter = require('./routes/registry');
const loginRouter = require('./routes/login');
const apiRouter = require('./routes/index');
const db = require('./db/index');
const redis = require('./db/redis');
const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Simple-Jsblog-API',
            version: '1.0.0',
            description: 'API list of simple-jsblog-server'
        }
    },
    apis: [
        './routes/*.js',
        // v1
        './routes/api/v1/*.js'
    ]
}
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(morgan('tiny', { stream, skip }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/registry', registryRouter);
app.use('/login', loginRouter);
app.use('/api/v1', apiRouter);

app.get('/heartbeat', async (req, res) => {
    try {
        logger.info('Check server status');
        const healthResults = {
            HttpServer: 'alive',
            DB: 'down',
            Redis: 'down'
        }
        const dbAlive = await db.isConnected();
        if(dbAlive) {
            healthResults.DB = 'alive';
        }
        const redisAlive = await redis.isConnected();
        if(redisAlive) {
            healthResults.Redis = 'alive';
        }
        res.status(200).json(healthResults);
    } catch (err) {
        logger.error(`Error occurred: ${err}`);
    }
});

const server = app.listen(Config.ServerPort, () => {
    logger.info(`Server is running on http://${Config.ServerAddr}:${Config.ServerPort} in ${Config.RunMode} mode`);
});

async function ShutdownDB() {
    try {
        logger.info('Disconnect DB ...');
        await db.pool.end();
        logger.debug('DB closed');
    } catch (err) {
        logger.error(`Error occurred in closing db connection: ${err}`);
    }
}

async function ShutdownRedis() {
    try {
        logger.info('Disconnect redis ...');
        await redis.redisClient.disconnect();
        logger.debug('Redis closed');
    } catch (err) {
        logger.error(`Error occurred in closing redis connection: ${err}`);
    }
}

// function ShutdownApp() {
//     logger.info('Server is closing ...');
//     server.close(() => {
//         logger.info('Server closed');
//     });
// }

process.on('SIGINT', async () => {
    try {
        logger.info('SIGINT signal received');
        await ShutdownRedis();
        await ShutdownDB();
        logger.info('Server is closing ...');
        server.close(() => {
            logger.info('Server closed');
        });
    } catch (err) {
        logger.error(`Error occur in operation after SIGINT signal received: ${err}`);
    }
});

process.on('SIGTERM', async () => {
    try {
        logger.info('SIGTERM signal received');
        await ShutdownRedis();
        await ShutdownDB();
        logger.info('Server is closing ...');
        server.close(() => {
            logger.info('Server closed');
        });
    } catch (err) {
        logger.error(`Error occur in operation after SIGTERM signal received: ${err}`);
    }
});

module.exports = {
    app,
    server
}
