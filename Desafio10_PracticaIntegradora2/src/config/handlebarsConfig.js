import handlebars from 'express-handlebars';

export default function configureHandlebars(app, __dirname) {
    app.engine('handlebars', handlebars.engine);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'handlebars');
}
