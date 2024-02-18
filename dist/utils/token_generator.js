"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateToken = () => {
    const token = crypto_1.default.createHash('sha256').update(crypto_1.default.randomBytes(20).toString('hex')).digest('hex');
    return token;
};
exports.generateToken = generateToken;
