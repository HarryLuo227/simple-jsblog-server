const Config = require('./configs/config');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const registryRouter = require('./routes/registry');
const loginRouter = require('./routes/login');
const apiRouter = require('./routes/index');
const db = require('./db/index');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/registry', registryRouter);
app.use('/login', loginRouter);
app.use('/api/v1', apiRouter);

app.get('/heartbeat', async (req, res) => {
    try {
        console.log('[Debug] Check server status');
        const healthResults = {
            HttpServer: 'alive',
            DB: "down"
        }
        const dbAlive = await db.isConnected();
        if(dbAlive) {
            healthResults.DB = 'alive';
        }
        res.status(200).send(healthResults);
    } catch (err) {
        console.log(`[Error] Error occurred: ${err}`);
    }
    
});

app.listen(Config.ServerPort, () => {
    console.log(`[Info] Server is running on http://${Config.ServerAddr}:${Config.ServerPort} in ${Config.RunMode} mode`);
});
