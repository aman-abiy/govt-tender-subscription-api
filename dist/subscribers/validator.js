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
exports.validatorFallback = void 0;
const express_validator_1 = require("express-validator");
const error_response_1 = __importDefault(require("../utils/error_response"));
const validatorFallback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // return next(new ErrorResponse(`${errors.array()[0].msg} '${errors.array()[0].value}' for ${errors.array()[0].param} input!`, 400, true))
        return next(new error_response_1.default(`${errors.array()[0].msg} for ${errors.array()[0].param} input!`, 400, true));
    }
    next();
});
exports.validatorFallback = validatorFallback;
