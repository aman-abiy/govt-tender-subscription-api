"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = __importDefault(require("../utils/error_response"));
const asyncHandler = (fn) => (req, res, next) => Promise
    .resolve(fn(req, res, next))
    // .catch((next))
    .catch((error) => {
    console.log(error);
    return next(new error_response_1.default(error.errorMessage, 500));
});
exports.default = asyncHandler;
