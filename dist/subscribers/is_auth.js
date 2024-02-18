"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const error_response_1 = __importDefault(require("../utils/error_response"));
const encryption_1 = require("../utils/encryption");
const Account_Model_1 = require("../models/Account_Model");
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next(new error_response_1.default('User authorization error: error identifying token', 401));
        }
        try {
            const account = yield Account_Model_1.AccountModel.findById(new mongoose_1.default.Types.ObjectId((0, encryption_1.decryptVal)(token)));
            if (!account) {
                return next(new error_response_1.default('User authorization error: account not found', 401));
            }
            if (!account.sessionToken) {
                return next(new error_response_1.default('User authorization error: your session has ended, please login again', 403));
            }
            if (!account.isActive) {
                return next(new error_response_1.default('User authorization error: your account is inactive', 403));
            }
            req.user = account;
            return next();
        }
        catch (error) {
            console.log(error);
            return next(new error_response_1.default('Server Error', 500));
        }
    }
    return next(new error_response_1.default('User authorization error: header authorization not set', 401));
});
exports.default = isAuth;
