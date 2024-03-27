class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAllTickets() {
        return this.dao.getAll();
    }

    getTicketById(ticketId) {
        return this.dao.getById(ticketId);
    }

    createTicket(ticketData) {
        return this.dao.create(ticketData);
    }

    deleteTicket(ticketId) {
        return this.dao.delete(ticketId);
    }

    updateItem(id, newData) {
        return this.dao.update(id, newData);
    }}

export default TicketRepository;
