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
exports.sendEmail = void 0;
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const response_handler_1 = require("../utils/response_handler");
const email_formats_config_1 = require("../config/email_formats.config");
const email_sender_1 = require("../subscribers/email_sender");
exports.sendEmail = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { startIndex, endIndex } = req.query;
    let emailPromoQuery = {};
    if (startIndex) {
        emailPromoQuery.startIndex = parseInt(startIndex.toString());
    }
    if (endIndex) {
        emailPromoQuery.endIndex = parseInt(endIndex.toString());
    }
    // let json: Array<string> = require('../utils/promo_emails/emails-1.json');
    let json = require('../utils/promo_emails/all_emails.json');
    let emailListSegment = json.slice(emailPromoQuery.startIndex, emailPromoQuery.endIndex);
    console.log(emailListSegment.length);
    emailListSegment.forEach((obj) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('obj.email', obj.email);
        let promoMailOptions = (0, email_formats_config_1.promoEmail)(obj.email);
        // console.log('promoMailOptions', promoMailOptions)
        let status = yield (0, email_sender_1.sendPromoEmail)(promoMailOptions);
    }));
    return (0, response_handler_1.responseHandler)({ res: res, status: false, statusCode: 200, msg: 'Promo Email Sent.' });
    // if (paymentMethods[0]) {
    //     try {
    //         fs.writeFile(`${BACKUP_DIR}/payment_methods/payment_methods-${backupTime}.json`, JSON.stringify(paymentMethods), 'utf-8', function(err) {
    //             console.log(err)
    //         })
    //         return responseHandler({res: res, status: true, statusCode: 200, msg: `Backed up ${paymentMethods.length} Payment Methods contents @${new Date(backupTime)}.` })
    //     } catch (e) {
    // return responseHandler({res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Payment Methods contents.' })
    //     }
    // }
    // return next(new ErrorResponse('No Payment Methods content found for backup.', 404))
}));
