// TicketMemoryDAO.js

class TicketMemoryDAO {
    constructor() {
        this.tickets = [];
    }

    getAllTickets() {
        return this.tickets;
    }

    getTicketById(id) {
        return this.tickets.find(ticket => ticket.id === id);
    }

    createTicket(ticket) {
        this.tickets.push(ticket);
        return ticket;
    }

    updateTicket(id, updatedTicket) {
        const index = this.tickets.findIndex(ticket => ticket.id === id);
        if (index !== -1) {
            this.tickets[index] = { ...this.tickets[index], ...updatedTicket };
            return this.tickets[index];
        }
        return null;
    }

    deleteTicket(id) {
        const index = this.tickets.findIndex(ticket => ticket.id === id);
        if (index !== -1) {
            const deletedTicket = this.tickets.splice(index, 1);
            return deletedTicket[0];
        }
        return null;
    }
}

export default TicketMemoryDAO;
