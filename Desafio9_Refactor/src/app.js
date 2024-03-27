import express from "express";
import router from "./routes/index.js";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import __dirname from './utils.js';
import http from 'http';
import { Server } from "socket.io";
import { MODEL_MESSAGES } from "./services/db/models/message.js";
import { UserModel } from "./services/db/models/user.js";
import { MongoClient, ServerApiVersion } from 'mongodb';
import session from "express-session";
import passport from 'passport';
import LocalStrategy from 'passport-local';
import GitHubStrategy from 'passport-github2';
import bcrypt from 'bcrypt';


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(session({
    secret: 'coderSecret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
    } catch (error) {
        return done(error);
    }
}));

passport.use('github', new GitHubStrategy({
    clientID: '5e9b9abbda4a0cdf2138',
    clientSecret: '8df9a050ded08dcbd8b946a63685c3f7a9f4f4c9',
    callbackURL: 'http://localhost:3000/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const { id, login, name, email } = profile._json;
        const user = await UserModel.findOne({ githubId: id });

        if (user) {
            return done(null, user);
        } else {
            const newUser = new UserModel({
                email: email,
                githubId: id,
                githubUsername: login,
                firstName: name,  
                lastName: name,   
            });

            await newUser.save();
            return done(null, newUser);
        }
    } catch (error) {
        return done(error);
    }
}));

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/products');  
    }
);

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.post('/register', async (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.render('register', { error: 'El usuario ya existe' });
        }
        const newUser = new UserModel({ email, firstName, lastName, password });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.render('register', { error: 'Error al registrar usuario' });
    }
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user = {
            email: 'adminCoder@coder.com',
            role: 'admin',
        };
        res.redirect('/products');
    } else {
        const user = await UserModel.findOne({ email, password });
        if (user) {
            req.session.user = {
                email: user.email,
                role: user.role,
            };
            res.redirect('/products');
        } else {
            res.render('login', { error: 'Credenciales incorrectas' });
        }
    }
});

app.use('/', router);

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
        }
        res.redirect('/login');
    });
});

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