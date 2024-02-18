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
exports.sendPromoEmail = exports.sendAlertEmail = exports.sendAuthEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const statics_config_1 = require("../config/statics.config");
/* Auth emails are emails sent to users relatied to some authentication actions, eg: [signup, password reset...] */
const sendAuthEmail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // send email
    var transporter = nodemailer_1.default.createTransport({
        host: 'mail.alphatenders.com',
        secure: true,
        auth: {
            user: statics_config_1.AUTH_EMAIL_SENDER,
            pass: statics_config_1.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return false;
        }
        else {
            return true;
        }
    });
    return true;
});
exports.sendAuthEmail = sendAuthEmail;
/* Alert emails are tender alert emails sent every 24 hours based on the users alert preference selection */
const sendAlertEmail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let status = true;
    // send email
    var transporter = nodemailer_1.default.createTransport({
        pool: true,
        host: 'mail.alphatenders.com',
        secure: true,
        auth: {
            user: statics_config_1.ALERT_SENDER,
            pass: statics_config_1.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    transporter.sendMail(mailOptions, function (error, info) {
        if (error)
            status = false;
        else
            status = true;
    });
    return status;
});
exports.sendAlertEmail = sendAlertEmail;
/* Alert emails are tender alert emails sent every 24 hours based on the users alert preference selection */
const sendPromoEmail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let status = true;
    // send email
    var transporter = nodemailer_1.default.createTransport({
        pool: true,
        host: 'mail.alphatenders.com',
        secure: true,
        auth: {
            user: statics_config_1.PROMO_EMAIL_SENDER,
            pass: statics_config_1.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    transporter.sendMail(mailOptions, function (error, info) {
        if (error)
            status = false;
        else
            status = true;
    });
    return status;
});
exports.sendPromoEmail = sendPromoEmail;
