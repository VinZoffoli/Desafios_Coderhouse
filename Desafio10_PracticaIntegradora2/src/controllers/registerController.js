import { UserModel } from '../services/db/models/user.js';

export async function registerUser(req, res) {
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
}
