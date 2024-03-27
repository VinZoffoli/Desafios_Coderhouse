import UserMemoryDAO from '../DAO/userMemory.DAO.js';
import UserDAO from '../DAO/user.DAO.js';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV;

let userFactory;

if (env === 'dev') {
    userFactory = UserMemoryDAO;
} else {
    userFactory = UserDAO;
}

export default userFactory;
