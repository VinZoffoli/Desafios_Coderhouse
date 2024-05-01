import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const collectionName = 'products';

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    status: Boolean,
    code: String,
    stock: Number,
    category: String,
});

productSchema.plugin(mongoosePaginate);

export const MODEL_PRODUCTS = mongoose.model(collectionName, productSchema);
export const ProductModel = mongoose.model('Product', productSchema);
