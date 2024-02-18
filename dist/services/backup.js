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
exports.backupTenders = exports.backupTenderSources = exports.backupPaymentMethods = exports.backupPayments = exports.backupSubscriptionPlan = exports.backupSubscriptions = exports.backupRegions = exports.backupLanguages = exports.backupCountries = exports.backupAccounts = void 0;
const fs_1 = __importDefault(require("fs"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const Country_Model_1 = require("../models/Country_Model");
const statics_config_1 = require("../config/statics.config");
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const Language_Model_1 = require("../models/Language_Model");
const Region_Model_1 = require("../models/Region_Model");
const Subscription_Model_1 = require("../models/Subscription_Model");
const Tender_Source_Model_1 = require("../models/Tender_Source_Model");
const Tender_Model_1 = require("../models/Tender_Model");
const Account_Model_1 = require("../models/Account_Model");
const Payment_Model_1 = require("../models/Payment_Model");
const Payment_Method_Model_1 = require("../models/Payment_Method_Model");
const Subscription_Plan_Model_1 = require("../models/Subscription_Plan_Model");
exports.backupAccounts = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let accounts = yield Account_Model_1.AccountModel.find();
    let backupTime = Date.now();
    if (accounts[0]) {
        try {
            fs_1.default.writeFile(`${statics_config_1.BACKUP_DIR}/accounts/accounts-${backupTime}.json`, JSON.stringify(accounts), 'utf-8', function (err) {
                console.log(err);
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, msg: `Backed up ${accounts.length} Account contents @${new Date(backupTime)}.` });
        }
        catch (e) {
            return (0, response_handler_1.responseHandler)({ res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Account contents.' });
        }
    }
    return next(new error_response_1.default('No Account content found for backup.', 404));
}));
exports.backupCountries = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let countries = yield Country_Model_1.CountryModel.find();
    let backupTime = Date.now();
    if (countries[0]) {
        try {
            fs_1.default.writeFile(`${statics_config_1.BACKUP_DIR}/countries/countries-${backupTime}.json`, JSON.stringify(countries), 'utf-8', function (err) {
                console.log(err);
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, msg: `Backed up ${countries.length} Country Contents @${new Date(backupTime)}.` });
        }
        catch (e) {
            return (0, response_handler_1.responseHandler)({ res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Country Contents.' });
        }
    }
    return next(new error_response_1.default('No Country content found for backup.', 404));
}));
exports.backupLanguages = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let languages = yield Language_Model_1.LanguageModel.find();
    let backupTime = Date.now();
    if (languages[0]) {
        try {
            fs_1.default.writeFile(`${statics_config_1.BACKUP_DIR}/languages/languages-${backupTime}.json`, JSON.stringify(languages), 'utf-8', function (err) {
                console.log(err);
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, msg: `Backed up ${languages.length} Language contents @${new Date(backupTime)}.` });
        }
        catch (e) {
            return (0, response_handler_1.responseHandler)({ res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Language contents.' });
        }
    }
    return next(new error_response_1.default('No Language content found for backup.', 404));
}));
exports.backupRegions = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let regions = yield Region_Model_1.RegionModel.find();
    let backupTime = Date.now();
    if (regions[0]) {
        try {
            fs_1.default.writeFile(`${statics_config_1.BACKUP_DIR}/regions/regions-${backupTime}.json`, JSON.stringify(regions), 'utf-8', function (err) {
                console.log(err);
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, msg: `Backed up ${regions.length} Region contents @${new Date(backupTime)}.` });
        }
        catch (e) {
            return (0, response_handler_1.responseHandler)({ res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Region contents.' });
        }
    }
    return next(new error_response_1.default('No Region content found for backup.', 404));
}));
exports.backupSubscriptions = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let subscriptions = yield Subscription_Model_1.SubscriptionModel.find();
    let backupTime = Date.now();
    if (subscriptions[0]) {
        try {
            fs_1.default.writeFile(`${statics_config_1.BACKUP_DIR}/subscriptions/subscriptions-${backupTime}.json`, JSON.stringify(subscriptions), 'utf-8', function (err) {
                console.log(err);
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, msg: `Backed up ${subscriptions.length} Subscription contents @${new Date(backupTime)}.` });
        }
        catch (e) {
            return (0, response_handler_1.responseHandler)({ res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Subscription contents.' });
        }
    }
    return next(new error_response_1.default('No Subscription content found for backup.', 404));
}));
exports.backupSubscriptionPlan = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let subscriptionPlans = yield Subscription_Plan_Model_1.SubscriptionPlanModel.find();
    let backupTime = Date.now();
    if (subscriptionPlans[0]) {
        try {
            fs_1.default.writeFile(`${statics_config_1.BACKUP_DIR}/subscription_plans/subscription_plans-${backupTime}.json`, JSON.stringify(subscriptionPlans), 'utf-8', function (err) {
                console.log(err);
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, msg: `Backed up ${subscriptionPlans.length} Subscription Plan contents @${new Date(backupTime)}.` });
        }
        catch (e) {
            return (0, response_handler_1.responseHandler)({ res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Subscription Plan contents.' });
        }
    }
    return next(new error_response_1.default('No Subscription Plan content found for backup.', 404));
}));
exports.backupPayments = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let payments = yield Payment_Model_1.PaymentModel.find();
    let backupTime = Date.now();
    if (payments[0]) {
        try {
            fs_1.default.writeFile(`${statics_config_1.BACKUP_DIR}/payments/payments-${backupTime}.json`, JSON.stringify(payments), 'utf-8', function (err) {
                console.log(err);
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, msg: `Backed up ${payments.length} Payments contents @${new Date(backupTime)}.` });
        }
        catch (e) {
            return (0, response_handler_1.responseHandler)({ res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Payments contents.' });
        }
    }
    return next(new error_response_1.default('No Payments content found for backup.', 404));
}));
exports.backupPaymentMethods = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let paymentMethods = yield Payment_Method_Model_1.PaymentMethodModel.find();
    let backupTime = Date.now();
    if (paymentMethods[0]) {
        try {
            fs_1.default.writeFile(`${statics_config_1.BACKUP_DIR}/payment_methods/payment_methods-${backupTime}.json`, JSON.stringify(paymentMethods), 'utf-8', function (err) {
                console.log(err);
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, msg: `Backed up ${paymentMethods.length} Payment Methods contents @${new Date(backupTime)}.` });
        }
        catch (e) {
            return (0, response_handler_1.responseHandler)({ res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Payment Methods contents.' });
        }
    }
    return next(new error_response_1.default('No Payment Methods content found for backup.', 404));
}));
exports.backupTenderSources = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let tenderSources = yield Tender_Source_Model_1.TenderSourceModel.find();
    let backupTime = Date.now();
    if (tenderSources[0]) {
        try {
            fs_1.default.writeFile(`${statics_config_1.BACKUP_DIR}/tender_sources/tenderSources-${backupTime}.json`, JSON.stringify(tenderSources), 'utf-8', function (err) {
                console.log(err);
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, msg: `Backed up ${tenderSources.length} Tender Source contents @${new Date(backupTime)}.` });
        }
        catch (e) {
            return (0, response_handler_1.responseHandler)({ res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Tender Source contents.' });
        }
    }
    return next(new error_response_1.default('No Tender Source content found for backup.', 404));
}));
exports.backupTenders = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let tenders = yield Tender_Model_1.TenderModel.find();
    let backupTime = Date.now();
    if (tenders[0]) {
        try {
            fs_1.default.writeFile(`${statics_config_1.BACKUP_DIR}/tenders/tenders-${backupTime}.json`, JSON.stringify(tenders), 'utf-8', function (err) {
                console.log(err);
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, msg: `Backed up ${tenders.length} Tender contents @${new Date(backupTime)}.` });
        }
        catch (e) {
            return (0, response_handler_1.responseHandler)({ res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Tender contents.' });
        }
    }
    return next(new error_response_1.default('No Tender content found for backup.', 404));
}));
