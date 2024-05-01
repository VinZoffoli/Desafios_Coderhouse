import TicketDAO from '../DAO/ticket.DAO.js';
import TicketMemoryDAO from '../DAO/ticketMemory.DAO.js';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV;

let ticketFactory;

if (env === 'dev') {
    ticketFactory = TicketMemoryDAO;
} else {
    ticketFactory = TicketDAO;
}

export default ticketFactory;
