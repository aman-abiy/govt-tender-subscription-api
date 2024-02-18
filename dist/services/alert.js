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
exports.alertEmailHandler = exports.setAlertCategories = exports.toggleAlertStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const Account_Model_1 = require("../models/Account_Model");
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const email_sender_1 = require("../subscribers/email_sender");
const email_formats_config_1 = require("../config/email_formats.config");
const Email_Result_Model_1 = require("../models/Email_Result_Model");
const statics_config_1 = require("../config/statics.config");
const pagination_1 = require("../utils/pagination");
exports.toggleAlertStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let account = yield Account_Model_1.AccountModel.findByIdAndUpdate(user._id, { alertStatus: !user.alertStatus });
    if (account) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: account });
    }
    return next(new error_response_1.default('Could not change alert status, please try again.', 500));
}));
exports.setAlertCategories = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let alertCategoryBody = (0, request_body_dtos_1.alertCategoryBodyCast)(req.body);
    let account = yield Account_Model_1.AccountModel.findByIdAndUpdate(user._id, { alertCategories: alertCategoryBody.categories });
    if (account) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: account });
    }
    return next(new error_response_1.default('Could not set alert category preference, please try again.', 500));
}));
exports.alertEmailHandler = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let emailResults = [];
    let { page, limit } = req.query;
    console.log('len req', req.query);
    let alertEmailEligibleAccounts = { hasActiveSubscription: true, alertStatus: true, $or: [{ alertRegions: { $exists: true, $ne: [] } }, { alertCategories: { $exists: true, $ne: [] } }] };
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), query: alertEmailEligibleAccounts, Schema: Account_Model_1.AccountModel });
    let accounts = yield Account_Model_1.AccountModel.find(alertEmailEligibleAccounts)
        .skip(paginationData.startIndex).limit(paginationData.limit);
    console.log('len', accounts.length);
    console.log('len e', accounts[0].email);
    let counter = 0;
    accounts.forEach((e, i) => __awaiter(void 0, void 0, void 0, function* () {
        // call email sender module
        let [alertMailOptions, tenders, readCheckKey] = yield (0, email_formats_config_1.alertEmail)(e);
        if (tenders.length > 0) {
            let status = yield (0, email_sender_1.sendAlertEmail)(alertMailOptions);
            emailResults.push({
                account: e._id,
                tenders: tenders.map((e) => new mongoose_1.default.Types.ObjectId(e._id)),
                sentToEmail: e.email,
                type: statics_config_1.EMAIL_TYPE_ALERT,
                readCheckKey: readCheckKey,
                isSent: status,
                isOpened: false,
                createdAt: new Date(Date.now())
            });
        }
        counter++;
        // when loop has ended
        if (counter == (accounts.length)) {
            let emailResultsResponse = yield Email_Result_Model_1.EmailResultModel.insertMany(emailResults);
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: emailResultsResponse });
        }
    }));
}));
