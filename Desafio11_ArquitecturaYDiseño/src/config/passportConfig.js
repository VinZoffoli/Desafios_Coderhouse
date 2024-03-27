import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import { UserModel } from "../DAO/models/user.js";
import bcrypt from 'bcrypt';
import LocalStrategy from 'passport-local';

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

//GITHUB
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


export default passport;
