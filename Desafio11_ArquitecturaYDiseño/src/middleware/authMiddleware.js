import session from "express-session";
import passport from 'passport';

export default function configureAuthMiddleware(app) {
    app.use(session({
        secret: 'coderSecret',
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());
}
