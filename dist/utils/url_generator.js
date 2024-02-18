"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePasswordResetLink = exports.generateVerificationLink = void 0;
const statics_config_1 = require("../config/statics.config");
const generateVerificationLink = (token) => {
    return new URL(`${statics_config_1.EMAIL_VERIFICATION_ROUTE}/${token}`);
};
exports.generateVerificationLink = generateVerificationLink;
const generatePasswordResetLink = (token) => {
    return new URL(`${statics_config_1.PASSWORD_RESET_ROUTE}/${token}`);
};
exports.generatePasswordResetLink = generatePasswordResetLink;
