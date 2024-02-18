"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorResponse extends Error {
    constructor(errorMessage, statusCode, validationError) {
        super(errorMessage);
        this.statusCode = statusCode;
        this.status = false;
        this.errorMessage = errorMessage;
        this.validationError = validationError;
    }
}
exports.default = ErrorResponse;
