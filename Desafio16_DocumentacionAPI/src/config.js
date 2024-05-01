import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL,
    ENVIRONMENT: process.env.NODE_ENV || 'prod',
};

export default config;