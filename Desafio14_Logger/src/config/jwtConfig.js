import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from "../DAO/models/user.js";

// Extractor de cookies para JWT
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

// Configuración de la estrategia JWT
const initializeJWTPassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: cookieExtractor,
        secretOrKey: '3W8Xr4hL7fPnCzTnU3fR2eT9kV3vP9xY' 
    }, async (payload, done) => {
        try {
            const user = await UserModel.findById(payload.id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));
}

export default initializeJWTPassport;