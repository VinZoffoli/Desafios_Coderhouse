import mongoose from "mongoose";

const collectionName = 'carts';


const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
            },
            quantity: {
                type: Number,
                default: 1,
            },
        }
    ]
});

export const MODEL_CARTS = mongoose.model(collectionName, cartSchema);
export const CartModel = mongoose.model('Cart', cartSchema);
