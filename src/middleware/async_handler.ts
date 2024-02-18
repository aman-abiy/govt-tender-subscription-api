import { Request, Response, NextFunction } from "express";
import ErrorResponse from '../utils/error_response';

const asyncHandler = (fn: (arg0: Request, arg1: Response, arg2: NextFunction) => any) => (req: Request, res: Response, next: NextFunction) =>
    Promise
    .resolve(fn(req, res, next))
    // .catch((next))
    .catch((error) => {
        console.log(error)
        return next(new ErrorResponse(error.errorMessage, 500))
    });

export default asyncHandler;