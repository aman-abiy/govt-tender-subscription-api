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
exports.sendDailyNotificationToUsers = void 0;
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const Account_Model_1 = require("../models/Account_Model");
const alert_tenders_1 = require("../utils/alert_tenders");
const fcm_formats_config_1 = require("../config/fcm_formats.config");
const Tender_Model_1 = require("../models/Tender_Model");
const functions_1 = require("../utils/functions");
const firebase_1 = __importDefault(require("../subscribers/firebase"));
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
exports.sendDailyNotificationToUsers = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    let dates = (0, functions_1.getStartEndDate)();
    let todaysTendersCount = yield Tender_Model_1.TenderModel.countDocuments({
        createdAt: { $gte: new Date(dates.startDate).toISOString(), $lt: new Date(dates.endDate).toISOString() }
    });
    if (todaysTendersCount == 0) {
        return next(new error_response_1.default('No tenders found today.', 404));
    }
    let accounts = yield Account_Model_1.AccountModel.find({ fcmToken: { $ne: null } });
    let countOfFCMSent = 0;
    accounts.forEach((account) => __awaiter(void 0, void 0, void 0, function* () {
        let FCMNoticicationMsg;
        if (account.hasActiveSubscription) {
            if (account.alertCategories.length > 0 || account.alertRegions.length > 0) {
                let [tenders, count] = yield (0, alert_tenders_1.getAlertTenders)(account);
                FCMNoticicationMsg = (0, fcm_formats_config_1.subscribedAccountsWithAlertFCM)(todaysTendersCount, count);
            }
            else {
                FCMNoticicationMsg = (0, fcm_formats_config_1.subscribedAccountsWithNoAlertFCM)(todaysTendersCount);
            }
        }
        else {
            FCMNoticicationMsg = (0, fcm_formats_config_1.notSubscribedAccountsFCM)(todaysTendersCount);
        }
        // send fcm notification
        const message_notification = {
            notification: {
                title: 'Alpha Tenders',
                body: FCMNoticicationMsg
            }
        };
        let response = yield firebase_1.default.messaging().sendToDevice(account.fcmToken, message_notification, notification_options);
        if (response.successCount > 0) {
            console.log('response.successCount', response.successCount);
            countOfFCMSent++;
        }
    }));
    console.log('countOfFCMSent', countOfFCMSent);
    return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, msg: `FCM notification sent to - ${countOfFCMSent} users out of - ${accounts.length} accounts selected for notification message.` });
}));
