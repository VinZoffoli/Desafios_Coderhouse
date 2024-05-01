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

    app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

    app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),
        (req, res) => {
            req.session.user = req.user;
            res.redirect('/products');  
        }
    );
}
