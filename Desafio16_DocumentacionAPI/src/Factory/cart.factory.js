import CartMemoryDAO from '../DAO/cartMemory.DAO.js';
import CartDAO from '../DAO/cart.DAO.js';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV;

let cartFactory;

if (env === 'dev') {
    cartFactory = CartMemoryDAO;
} else {
    cartFactory = CartDAO;
}

export default cartFactory;
