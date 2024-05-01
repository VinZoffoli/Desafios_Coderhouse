import Ticket from './models/ticket';

class TicketDAO {
    async create(ticketData) {
        try {
            return await Ticket.create(ticketData);
        } catch (error) {
            throw new Error(`Error creating ticket: ${error}`);
        }
    }

    async getAll() {
        try {
            return await Ticket.find();
        } catch (error) {
            throw new Error(`Error getting tickets: ${error}`);
        }
    }

    async getById(ticketId) {
        try {
            return await Ticket.findById(ticketId);
        } catch (error) {
            throw new Error(`Error getting ticket by ID: ${error}`);
        }
    }

    async update(ticketId, updatedData) {
        try {
            return await Ticket.findByIdAndUpdate(ticketId, updatedData, { new: true });
        } catch (error) {
            throw new Error(`Error updating ticket: ${error}`);
        }
    }

    async delete(ticketId) {
        try {
            return await Ticket.findByIdAndDelete(ticketId);
        } catch (error) {
            throw new Error(`Error deleting ticket: ${error}`);
        }
    }
}

export default TicketDAO;
