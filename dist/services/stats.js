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
exports.getCurrentMonthSalesCount = exports.getLast10DaysSalesCount = exports.getLast10DaysUserCount = exports.getUserCountByService = exports.getUserCountBySubscriptionStatus = void 0;
const moment_1 = __importDefault(require("moment"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const Account_Model_1 = require("../models/Account_Model");
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const statics_config_1 = require("../config/statics.config");
const Payment_Model_1 = require("../models/Payment_Model");
exports.getUserCountBySubscriptionStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let stats = {
        active: yield Account_Model_1.AccountModel.countDocuments({ hasActiveSubscription: true, lastActiveSubscription: { $ne: null } }),
        pending: yield Account_Model_1.AccountModel.countDocuments({ hasActiveSubscription: false, lastActiveSubscription: null, subscriptions: { $eq: [] } }),
        expired: yield Account_Model_1.AccountModel.countDocuments({ hasActiveSubscription: false, lastActiveSubscription: { $ne: null }, subscriptions: { $ne: [] } }),
        total: yield Account_Model_1.AccountModel.countDocuments()
    };
    if (stats) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: stats });
    }
    return next(new error_response_1.default('Could not get subscription status stats.', 500));
}));
exports.getUserCountByService = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let stats = {
        mobileApp: yield Account_Model_1.AccountModel.countDocuments({ mobileDeviceInfo: { $ne: null } }),
        webApp: yield Account_Model_1.AccountModel.countDocuments({ mobileDeviceInfo: { $eq: null } })
    };
    if (stats) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: stats });
    }
    return next(new error_response_1.default('Could not get users count by service stats.', 500));
}));
exports.getLast10DaysUserCount = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get date and convert to ISO Date object
    const date = new Date();
    const ISODate = date.toISOString();
    // date today
    let todaysDateString = ISODate.split(/\D+/);
    let today = new Date(Date.UTC(parseInt(todaysDateString[0]), parseInt(todaysDateString[1]) - 1, parseInt(todaysDateString[2]), parseInt(todaysDateString[3]), parseInt(todaysDateString[4]), parseInt(todaysDateString[5]), parseInt(todaysDateString[6])));
    // date 30 days earlier
    let prior10DaysDateNum = new Date().setDate(date.getDate() - statics_config_1.DEFAULT_LAST_X_DAYS_USER_STATS_FETCH);
    let prior10DaysISO = new Date(prior10DaysDateNum).toISOString();
    let prior10DaysString = prior10DaysISO.split(/\D+/);
    let prior10Days = new Date(Date.UTC(parseInt(prior10DaysString[0]), parseInt(prior10DaysString[1]) - 1, parseInt(prior10DaysString[2]), parseInt(prior10DaysString[3]), parseInt(prior10DaysString[4]), parseInt(prior10DaysString[5]), parseInt(prior10DaysString[6])));
    console.log(today, prior10Days);
    let days = [];
    let counts = [];
    let accounts = yield Account_Model_1.AccountModel.find({ createdAt: { $gt: prior10Days, $lt: today } });
    console.log('accounts ', accounts.length);
    // let accountCreatedAts: Array<String> = accounts.map((e: Account) => e.createdAt.toISOString().split('T')[0])
    // console.log('accountCreatedAts ', accountCreatedAts)
    for (let day = 0; day < statics_config_1.DEFAULT_LAST_X_DAYS_USER_STATS_FETCH; day++) {
        let priorDaysNum = new Date().setDate(date.getDate() - day);
        let priorDaysIso = new Date(priorDaysNum).toISOString();
        let priorDaysString = priorDaysIso.split(/\D+/);
        let priorDays = new Date(Date.UTC(parseInt(priorDaysString[0]), parseInt(priorDaysString[1]) - 1, parseInt(priorDaysString[2]), parseInt(priorDaysString[3]), parseInt(priorDaysString[4]), parseInt(priorDaysString[5]), parseInt(priorDaysString[6])));
        let count = 0;
        for (let index in accounts) {
            if (accounts[index].createdAt.toISOString().split('T')[0] === priorDays.toISOString().split('T')[0]) {
                count++;
            }
        }
        days.push(statics_config_1.DAYS_OF_THE_WEEK[new Date(new Date().setDate(date.getDate() - day)).getDay()]);
        counts.push(count);
    }
    console.log(days.reverse());
    console.log(counts.reverse());
    let stats = {
        weekDays: days,
        counts: counts
    };
    if (stats) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: stats });
    }
    return next(new error_response_1.default('Could not get last 30 days user stats.', 500));
}));
exports.getLast10DaysSalesCount = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get date and convert to ISO Date object
    const date = new Date();
    const ISODate = date.toISOString();
    // date today
    let todaysDateString = ISODate.split(/\D+/);
    let today = new Date(Date.UTC(parseInt(todaysDateString[0]), parseInt(todaysDateString[1]) - 1, parseInt(todaysDateString[2]), parseInt(todaysDateString[3]), parseInt(todaysDateString[4]), parseInt(todaysDateString[5]), parseInt(todaysDateString[6])));
    // date 30 days earlier
    let prior10DaysDateNum = new Date().setDate(date.getDate() - statics_config_1.DEFAULT_LAST_X_DAYS_USER_STATS_FETCH);
    let prior10DaysISO = new Date(prior10DaysDateNum).toISOString();
    let prior10DaysString = prior10DaysISO.split(/\D+/);
    let prior10Days = new Date(Date.UTC(parseInt(prior10DaysString[0]), parseInt(prior10DaysString[1]) - 1, parseInt(prior10DaysString[2]), parseInt(prior10DaysString[3]), parseInt(prior10DaysString[4]), parseInt(prior10DaysString[5]), parseInt(prior10DaysString[6])));
    console.log(today, prior10Days);
    let days = [];
    let saleAmount = [];
    let payments = yield Payment_Model_1.PaymentModel.find({ createdAt: { $gt: prior10Days, $lt: today } });
    console.log('accounts ', payments.length);
    // let paymentCreatedAts: Array<String> = payments.map((e: Payment) => e.createdAt.toISOString().split('T')[0])
    // console.log('paymentCreatedAts ', paymentCreatedAts)
    for (let day = 0; day < statics_config_1.DEFAULT_LAST_X_DAYS_USER_STATS_FETCH; day++) {
        let priorDaysNum = new Date().setDate(date.getDate() - day);
        let priorDaysIso = new Date(priorDaysNum).toISOString();
        let priorDaysString = priorDaysIso.split(/\D+/);
        let priorDays = new Date(Date.UTC(parseInt(priorDaysString[0]), parseInt(priorDaysString[1]) - 1, parseInt(priorDaysString[2]), parseInt(priorDaysString[3]), parseInt(priorDaysString[4]), parseInt(priorDaysString[5]), parseInt(priorDaysString[6])));
        let amount = 0;
        for (let index in payments) {
            if (payments[index].createdAt.toISOString().split('T')[0] === priorDays.toISOString().split('T')[0]) {
                amount += payments[index].price;
            }
        }
        days.push(statics_config_1.DAYS_OF_THE_WEEK[new Date(new Date().setDate(date.getDate() - day)).getDay()]);
        saleAmount.push(amount);
    }
    console.log(days.reverse());
    console.log(saleAmount.reverse());
    let stats = {
        weekDays: days,
        saleAmountByDay: saleAmount
    };
    if (stats) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: stats });
    }
    return next(new error_response_1.default('Could not get last 30 days user stats.', 500));
}));
exports.getCurrentMonthSalesCount = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get date and convert to ISO Date object
    const startOfMonth = (0, moment_1.default)().clone().startOf('month').toDate();
    const endOfMonth = (0, moment_1.default)().clone().endOf('month').toDate();
    console.log(startOfMonth);
    console.log(endOfMonth);
    let payments = yield Payment_Model_1.PaymentModel.find({ price: { $gt: 0 }, createdAt: { $gt: startOfMonth, $lt: endOfMonth } });
    console.log('payments ', payments.length);
    let totalAmount = 0;
    let stats = {
        currentMonth: (0, moment_1.default)().format('MMMM'),
        count: payments.length,
        saleAmount: payments.reduce((prev, curr) => prev + curr.price, totalAmount)
    };
    if (stats) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: stats });
    }
    return next(new error_response_1.default('Could not get last 30 days user stats.', 500));
}));
