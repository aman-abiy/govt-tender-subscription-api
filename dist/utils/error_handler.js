"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    //  handles response for errors created through ErrorResponse fn
    console.log('caught error', err);
    return res.status(err.statusCode || 500).json({
        status: false,
        hasError: true,
        message: err.errorMessage || 'Error! Something went wrong.',
        error: err
    });
};
exports.errorHandler = errorHandler;
exports.default = exports.errorHandler;
