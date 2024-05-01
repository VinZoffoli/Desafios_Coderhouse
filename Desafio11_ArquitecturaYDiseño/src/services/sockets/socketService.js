import { MODEL_MESSAGES } from "../../DAO/models/message.js";

export default function configureSockets(io, server, PORT) {
    io.on('connection', async (socket) => {
        console.log('Nuevo cliente conectado');

        const getPreviousMessages = async () => {
            try {
                const previousMessages = await MODEL_MESSAGES.find();
                socket.emit('previousMessages', previousMessages);
            } catch (error) {
                console.error('Error al obtener mensajes previos desde MongoDB:', error);
            }
        };

        await getPreviousMessages();

        socket.on('chatMessage', async (message) => {
            try {
                await MODEL_MESSAGES.create(message);
                io.emit('newChatMessage', message);
            } catch (error) {
                console.error('Error al guardar el mensaje en MongoDB:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Un cliente se ha desconectado');
        });
    });

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
