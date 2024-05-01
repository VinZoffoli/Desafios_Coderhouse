import EErrors from '../../handlers/errors/enum-errors.js';

const errorMiddleware = (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {
        case EErrors.INVALID_USER_INFO:
            res
                .status(EErrors.INVALID_USER_INFO)
                .json({ status: 'error', error: error.name });
            break;

        default:
            res
                .status(EErrors.INTERNAL_SERVER_ERROR)
                .json({ status: 'error', error: 'Internal Server Error' });
            break;
    }
};

export default errorMiddleware;
