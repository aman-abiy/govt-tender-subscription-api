import { Request, Response, NextFunction } from "express";
import ErrorResponse from './error_response';

export const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    //  handles response for errors created through ErrorResponse fn
    console.log('caught error', err)
    return res.status(err.statusCode || 500).json({
        status: false,
        hasError: true,
        message: err.errorMessage || 'Error! Something went wrong.',
        error: err
    })
}

export default errorHandler;