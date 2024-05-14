import passport from 'passport';
import jwt from 'jsonwebtoken';

// Generar token JWT
function generateJWTToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(payload, '3W8Xr4hL7fPnCzTnU3fR2eT9kV3vP9xY', { expiresIn: '1h' });
}

// Controlador para el inicio de sesión
export async function login(req, res) {
    try {
        // Autenticar con passport local
        passport.authenticate('local', { session: false }, (err, user) => {
            if (err || !user) {
                return res.status(401).json({ message: 'Credenciales incorrectas' });
            }
            const token = generateJWTToken(user);
            res.cookie('jwt', token, { httpOnly: true });
            res.status(200).json({ user, token });
        })(req, res);
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Controlador para cerrar sesión
export function logout(req, res) {
    try {
        res.clearCookie('jwt');
        res.sendStatus(200);
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
