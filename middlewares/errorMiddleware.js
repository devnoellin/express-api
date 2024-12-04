// middlewares/errorMiddleware.js
const { ValidationError } = require('../handlers/apiErrors');

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(400).json({
            result: 'error',
            code: err.code || 'UNKNOWN_ERROR',
            msg: err.message || '',
            errors: err.errors || {}
        });
    }

    return res.status(500).json({
        result: 'error',
        msg: 'Internal Server Error',
        code: 'E50000',
        errors: {},
    });
};

module.exports = errorMiddleware;