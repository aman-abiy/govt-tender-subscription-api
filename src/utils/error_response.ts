class ErrorResponse extends Error {
    statusCode: number;
    status: boolean;
    errorMessage: string;
    validationError?: boolean;

    constructor(errorMessage: string, statusCode: number, validationError?: boolean) {
        super(errorMessage);
        this.statusCode = statusCode;
        this.status = false;
        this.errorMessage = errorMessage;
        this.validationError = validationError;
    }
    
}

export default ErrorResponse;