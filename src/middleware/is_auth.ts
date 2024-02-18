import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from './async_handler'
import ErrorResponse from '../utils/error_response';
import { decryptVal } from "../utils/encryption";
import { AccountModel } from '../models/Account_Model';
import Account from '../interfaces/Account';

const isAuth = async(req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next(new ErrorResponse('User authorization error: error identifying token', 401))
        }

        try {
            const account: Account = await AccountModel.findById(new mongoose.Types.ObjectId(decryptVal(token)));

            if (!account) {
                return next(new ErrorResponse('User authorization error: account not found', 401))
            }
            if (!account.sessionToken) {
                return next(new ErrorResponse('User authorization error: your session has ended, please login again', 401))
            }
            if (!account.isActive) {
                return next(new ErrorResponse('User authorization error: your account is inactive', 401))
            }
            req.user = account;
            return next();
        } catch (error) {
            console.log(error)
            return next(new ErrorResponse('Server Error', 500))
        }
    }
    return next(new ErrorResponse('User authorization error: header authorization not set', 401))
}

export default isAuth