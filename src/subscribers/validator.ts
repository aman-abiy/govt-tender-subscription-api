import { Request, Response, NextFunction } from "express";
import { validationResult } from 'express-validator';
import ErrorResponse from "../utils/error_response";

export const validatorFallback = async(req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return next(new ErrorResponse(`${errors.array()[0].msg} '${errors.array()[0].value}' for ${errors.array()[0].param} input!`, 400, true))
        return next(new ErrorResponse(`${errors.array()[0].msg} for ${errors.array()[0].param} input!`, 400, true))
    }
    next()
}