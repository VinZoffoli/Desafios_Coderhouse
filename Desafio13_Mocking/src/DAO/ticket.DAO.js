import TicketModel from './models/ticket.js'

class TicketDAO {
    async create(ticketData) {
        try {
            return await TicketModel.create(ticketData);
        } catch (error) {
            throw new Error(`Error creating ticket: ${error}`);
        }
    }

    async getAll() {
        try {
            return await TicketModel.find();
        } catch (error) {
            throw new Error(`Error getting tickets: ${error}`);
        }
    }

    async getById(ticketId) {
        try {
            return await TicketModel.findById(ticketId);
        } catch (error) {
            throw new Error(`Error getting ticket by ID: ${error}`);
        }
    }

    async update(ticketId, updatedData) {
        try {
            return await TicketModel.findByIdAndUpdate(ticketId, updatedData, { new: true });
        } catch (error) {
            throw new Error(`Error updating ticket: ${error}`);
        }
    }

    async delete(ticketId) {
        try {
            return await TicketModel.findByIdAndDelete(ticketId);
        } catch (error) {
            throw new Error(`Error deleting ticket: ${error}`);
        }
    }
}

export default TicketDAO;
