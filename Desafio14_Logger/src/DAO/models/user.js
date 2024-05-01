import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
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
    age: {
        type: Number,
    },
    role: {
        type: String,
        default: 'usuario',
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    },
    githubId: String,
    githubUsername: String,
});

// Middleware para crear un nuevo carrito si el usuario no tiene uno
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        if (!this.cartId) {
            const Cart = mongoose.model('Cart');
            const cart = await Cart.create({ products: [] });
            this.cartId = cart._id;
        }
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const UserModel = mongoose.model('User', userSchema);

export { UserModel };
