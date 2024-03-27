import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: 'usuario',
    },
    githubId: String,
    githubUsername: String,
});

export const UserModel = mongoose.model('User', userSchema);