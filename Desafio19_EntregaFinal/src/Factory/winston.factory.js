import config from '../config/config.js'; 
import devLogger from '../utils/winston/devLogger.js';
import prodLogger from '../utils/winston/prodLogger.js';

const environment = config.ENVIRONMENT;

let logger;

switch (environment) {
    case 'dev':
        logger = devLogger;
        break;

    case 'prod':
        logger = prodLogger;
        break;

    default:
        logger = devLogger;
}

export default logger;