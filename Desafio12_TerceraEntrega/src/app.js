import express from "express";
import router from "./routes/index.js";
import cookieParser from 'cookie-parser';
import __dirname from './utils.js';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from "socket.io";
import connectMongoDB from './config/dbConfig.js';
import configureSockets from './services/sockets/socketService.js';
import configureAuthMiddleware from './middleware/authMiddleware.js';
import handlebars from 'express-handlebars';
import initializeJWTPassport from "./config/jwtConfig.js";
import config from './config.js';

dotenv.config();

const app = express(); // Crea una nueva aplicación Express
const server = http.createServer(app); // Crea un servidor HTTP utilizando la aplicación Express
const io = new Server(server); // Crea una instancia de Socket.io para gestionar WebSockets

// Configura el middleware de autenticación de Passport.js
configureAuthMiddleware(app);
app.use(cookieParser());
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'handlebars');

// Redirige la raíz a la página de inicio de sesión
app.get('/', (req, res) => { res.redirect('/auth/login'); });

// Utiliza las rutas definidas en el enrutador principal
app.use('/', router);

initializeJWTPassport()

// Configura los sockets para la aplicación
configureSockets(io, server, config.PORT);

// Exporta la función para obtener la instancia de Socket.io
export function getIO() { return io; }

// Conecta a la base de datos MongoDB
connectMongoDB();