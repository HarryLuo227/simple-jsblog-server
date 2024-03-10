const Config = require('../configs/config');
const winston = require('winston');

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
}
function level() {
    return Config.RunMode === 'debug' ? 'debug' : 'http';
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
}
winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)
);

const transports = [
    new winston.transports.Console()
]

const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports
});

module.exports = logger;
