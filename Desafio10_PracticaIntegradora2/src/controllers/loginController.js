import { UserModel } from '../services/db/models/user.js';

export async function loginUser(req, res) {
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
}
