class TicketService {
    static async generateTicket(user, products) {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

        let ticketContent = `Ticket de compra\n\n`;
        ticketContent += `Fecha: ${formattedDate}\n`;
        ticketContent += `Hora: ${formattedTime}\n\n`;
        ticketContent += `Cliente: ${user.firstName} ${user.lastName}\n\n`; 
        ticketContent += `Productos:\n`;

        products.forEach((product, index) => {
            ticketContent += `${index + 1}. ${product.product.title} - Cantidad: ${product.quantity}\n`;
            ticketContent += `   Precio unitario: $${product.product.price}\n`; 
            ticketContent += `   Total: $${product.product.price * product.quantity}\n\n`; 
        });

        const total = products.reduce((acc, product) => acc + product.product.price * product.quantity, 0);
        ticketContent += `Total de la compra: $${total}\n`;

        return ticketContent;
    }
}

export default TicketService;
