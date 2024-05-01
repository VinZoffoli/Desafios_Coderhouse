import ProductModel from '../DAO/models/product.js';
import CustomError from '../handlers/errors/custom-error.js';
import EErrors from '../handlers/errors/enum-errors.js';

export const checkProductOwner = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if (!product) {
            throw new CustomError(EErrors.PRODUCT_NOT_FOUND);
        }
        if (product.owner !== req.user.email) {
            throw new CustomError(EErrors.UNAUTHORIZED);
        }
        next();
    } catch (error) {
        next(error);
    }
};