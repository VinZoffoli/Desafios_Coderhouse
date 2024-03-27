import express from "express";
import router from "./routes/index.js";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import __dirname from './utils.js';
import http from 'http';
import { Server } from "socket.io";
import { MODEL_MESSAGES } from "./services/db/models/message.js";
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/', router);

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

export function getIO() {
    return io;
}

const connectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://vinzoffoli:ObSRyT2RTBIqqkKo@cluster0.eboydle.mongodb.net/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("Conectado con éxito a MongoDB usando Mongoose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Mongoose: " + error);
        process.exit();
    }
};

connectMongoDB();