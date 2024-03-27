import winston from 'winston';

const winstonLogger = winston.createLogger({
    transports: [new winston.transports.Console({ level: 'debug' })],
});

export default winstonLogger;