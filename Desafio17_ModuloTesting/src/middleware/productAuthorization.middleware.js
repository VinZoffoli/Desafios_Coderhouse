import UserModel from '../DAO/models/user.js';
import CustomError from '../handlers/errors/custom-error.js';
import EErrors from '../handlers/errors/enum-errors.js';

export const checkProductAuthorization = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if (!user) {
            throw new CustomError(EErrors.USER_NOT_FOUND);
        }
        if (user.role !== 'admin' && user.role !== 'premium') {
            throw new CustomError(EErrors.UNAUTHORIZED);
        }
        next();
    } catch (error) {
        next(error);
    }
};