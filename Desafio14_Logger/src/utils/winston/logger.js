import winston from 'winston';

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'http' }),
        new winston.transports.File({ filename: './errors.log', level: 'error' }), // Cambiar nivel a 'error'
    ],
});

const addLogger = (req, res, next) => {
    req.logger = logger;

    req.logger.http(
        `${req.method} - ${req.url} / ${req.headers['user-agent']} - ${new Date().toUTCString()}`
    );

    next();
};

export default addLogger;