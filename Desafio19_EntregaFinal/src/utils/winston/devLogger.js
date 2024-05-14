import winston from 'winston';
import customWinston from './custom.winston.js'; 
const { levels } = customWinston;

const devLogger = winston.createLogger({
    levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customWinston.colors }),
                winston.format.simple()
            ),
        }),
    ],
});

export default devLogger;