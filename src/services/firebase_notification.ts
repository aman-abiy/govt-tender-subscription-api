import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import Account from "../interfaces/Account";
import { AccountModel } from '../models/Account_Model';
import { getAlertTenders } from '../utils/alert_tenders';
import Tender from "../interfaces/Tender";
import { notSubscribedAccountsFCM, subscribedAccountsWithAlertFCM, subscribedAccountsWithNoAlertFCM } from '../config/fcm_formats.config';
import { TenderModel } from "../models/Tender_Model";
import { getStartEndDate } from '../utils/functions';
import admin from '../subscribers/firebase'
import { MessagingDevicesResponse, MessagingPayload } from "firebase-admin/lib/messaging/messaging-api";
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';

export const sendDailyNotificationToUsers = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    let dates = getStartEndDate()

    let todaysTendersCount = await TenderModel.countDocuments({
        createdAt: { $gte: new Date(dates.startDate).toISOString(), $lt: new Date(dates.endDate).toISOString() }
    })

    if(todaysTendersCount == 0) {
        return next(new ErrorResponse('No tenders found today.', 404))
    }

    let accounts: Array<Account> = await AccountModel.find({ fcmToken: { $ne: null } })
    let countOfFCMSent: number = 0

    
    accounts.forEach(async(account: Account) => {
        let FCMNoticicationMsg: string;
        
        if(account.hasActiveSubscription) {
            if(account.alertCategories.length > 0 || account.alertRegions.length > 0) {
                let [tenders, count]: [Array<Tender>, number] = await getAlertTenders(account);

                FCMNoticicationMsg = subscribedAccountsWithAlertFCM(todaysTendersCount, count)
            } else {
                FCMNoticicationMsg = subscribedAccountsWithNoAlertFCM(todaysTendersCount)
            }
        } else {
            FCMNoticicationMsg = notSubscribedAccountsFCM(todaysTendersCount)
        }

        // send fcm notification
        const message_notification: MessagingPayload = {
            notification: {
                title: 'Alpha Tenders',
                body: FCMNoticicationMsg
            }
        };

        let response: MessagingDevicesResponse = await admin.messaging().sendToDevice(account.fcmToken, message_notification, notification_options)
        if(response.successCount > 0) {
            console.log('response.successCount', response.successCount)
            countOfFCMSent++}
    
    })

    console.log('countOfFCMSent', countOfFCMSent)

    return responseHandler({res: res, status: true, statusCode: 200, msg: `FCM notification sent to - ${countOfFCMSent} users out of - ${accounts.length} accounts selected for notification message.` })

})