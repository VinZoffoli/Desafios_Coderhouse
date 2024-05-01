import TicketRepository from '../Repository/ticket.repository.js';

async function getAllTickets(req, res) {
    try {
        const tickets = await TicketRepository.getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function getTicketById(req, res) {
    const ticketId = req.params.id;
    try {
        const ticket = await TicketRepository.getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function createTicket(req, res) {
    const ticketData = req.body;
    try {
        const newTicket = await TicketRepository.createTicket(ticketData);
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
async function updateTicket(req, res) {
    const ticketId = req.params.id;
    const updatedTicketData = req.body;
    try {
        const updatedTicket = await TicketRepository.updateTicket(ticketId, updatedTicketData);
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
async function deleteTicket(req, res) {
    const ticketId = req.params.id;
    try {
        await TicketRepository.deleteTicket(ticketId);
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export default {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket
};