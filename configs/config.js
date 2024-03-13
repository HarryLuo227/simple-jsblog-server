const Config = {
    RunMode: process.env.RUN_MODE,
    ServerAddr: process.env.SERVER_ADDRESS,
    ServerPort: process.env.SERVER_PORT,

    DBServerType: process.env.DB_SERVERTYPE,
    DBUser: process.env.DB_USER,
    DBPassword: process.env.DB_PASSWORD,
    DBAddr: process.env.DB_ADDRESS,
    DBPort: process.env.DB_PORT,
    DBName: process.env.DB_DBNAME,

    RedisAddr: process.env.REDIS_ADDRESS,
    RedisPort: process.env.REDIS_PORT,
    RedisUser: process.env.REDIS_USER,
    RedisPassword: process.env.REDIS_PASSWORD,

    JwtIssuer: process.env.JWT_ISSUER,
    JwtExpire: process.env.JWT_EXPIRE,
    JwtSecret: process.env.JWT_SECRET
}

module.exports = Config;
