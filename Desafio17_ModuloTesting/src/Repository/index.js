import productFactory from '../Factory/product.factory.js';
import cartFactory from '../Factory/cart.factory.js';
import userFactory from '../Factory/user.factory.js';
import ticketFactory from '../Factory/ticket.factory.js'; 
import ProductRepository from '../Repository/product.repository.js';
import CartRepository from '../Repository/cart.repository.js';
import UserRepository from '../Repository/user.repository.js';
import TicketRepository from '../Repository/ticket.repository.js'; 

const productRepository = new ProductRepository(new productFactory());
const cartRepository = new CartRepository(new cartFactory());
const userRepository = new UserRepository(new userFactory());
const ticketRepository = new TicketRepository(new ticketFactory()); 

export { productRepository, cartRepository, userRepository, ticketRepository };