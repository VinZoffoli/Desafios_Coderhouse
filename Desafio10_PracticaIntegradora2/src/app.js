import express from "express";
import router from "./routes/index.js";
import cookieParser from 'cookie-parser';
import __dirname from './utils.js';
import http from 'http';
import { Server } from "socket.io";
import configureHandlebars from './config/handlebarsConfig.js';
import connectMongoDB from './config/dbConfig.js';
import configureSockets from './services/sockets/socketService.js';
import passport from './config/passportConfig.js';
import configureAuthMiddleware from './middleware/authMiddleware.js';
import middleware from './middleware/middleware.js';
import userRoutes from './routes/userRoutes.js';

const app = express(); // Crea una nueva aplicación Express
const server = http.createServer(app); // Crea un servidor HTTP utilizando la aplicación Express
const io = new Server(server); // Crea una instancia de Socket.io para gestionar WebSockets
const PORT = process.env.PORT || 3000; // Define el puerto en el que se ejecutará el servidor

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

//Configuracion de Handlebars
configureHandlebars(app, __dirname);

// Usa el middleware importado en la aplicación
app.use(middleware);

//Rutas de Login, Register y Logout
app.use('/', userRoutes);

// Redirige la raíz a la página de inicio de sesión
app.get('/', (req, res) => { res.redirect('/login'); });

// Utiliza las rutas definidas en el enrutador principal
app.use('/', router);

app.get('/api/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});

// Configura los sockets para la aplicación
configureSockets(io, server, PORT);

// Exporta la función para obtener la instancia de Socket.io
export function getIO() { return io; }

// Conecta a la base de datos MongoDB
connectMongoDB();