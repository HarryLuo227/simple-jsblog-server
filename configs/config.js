const Config = {
    RunMode: process.env.RUN_MODE,
    ServerAddr: process.env.SERVER_ADDRESS,
    ServerPort: process.env.SERVER_PORT,

    DBServerType: process.env.DB_SERVERTYPE,
    DBUser: process.env.DB_USER,
    DBPassword: process.env.DB_PASSWORD,
    DBAddr: process.env.DB_ADDRESS,
    DBPort: process.env.DB_PORT,
    DBName: process.env.DB_DBNAME
}

module.exports = Config;
