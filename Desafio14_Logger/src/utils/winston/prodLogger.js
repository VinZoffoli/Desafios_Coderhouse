import winston from 'winston';
import customWinston from './custom.winston.js';

const { levels } = customWinston;

const winstonLogger = winston.createLogger({
    levels,
    transports: [
        new winston.transports.Console({
            level: 'http',
            format: winston.format.combine(
                winston.format.colorize({ colors: customWinston.colors }),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error', 
            format: winston.format.simple(),
        }),
    ],
});

export default winstonLogger;