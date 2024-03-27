import handlebars from "express-handlebars";
import express from 'express';

const middleware = express();

middleware.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

middleware.use(express.json());
middleware.use(express.urlencoded({ extended: true }));

middleware.use(express.static('public'));

middleware.engine('handlebars', handlebars.engine());
middleware.set('views', 'views');
middleware.set('view engine', 'handlebars');

export default middleware;
