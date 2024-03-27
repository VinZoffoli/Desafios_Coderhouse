import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    total: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

export default TicketModel;
