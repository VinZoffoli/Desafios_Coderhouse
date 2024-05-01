import logger from '../Factory/winston.factory.js';

const loggerMiddleware = (req, res, next) => {
    req.logger = logger;

    req.logger.http(
        `${req.method} - ${req.url} / ${req.headers['user-agent']} - ${new Date().toUTCString()}`
    );

    next();
};

export default loggerMiddleware;