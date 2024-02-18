import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import Account from '../interfaces/Account';
import { AlertCategoryBody, SendEmailResponse, MailOptions } from '../utils/types/method_return_dtos';
import { alertCategoryBodyCast } from '../utils/types/request_body_dtos';
import { AccountModel } from '../models/Account_Model';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import { sendAlertEmail } from '../subscribers/email_sender';
import { alertEmail } from "../config/email_formats.config";
import { EmailResultModel } from '../models/Email_Result_Model';
import EmailResult from "../interfaces/Email_Result";
import { EMAIL_TYPE_ALERT } from "../config/statics.config";
import Tender from "../interfaces/Tender";
import { paginationHandler } from "../utils/pagination";

export const toggleAlertStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let account: Account = await AccountModel.findByIdAndUpdate(user._id, { alertStatus: !user.alertStatus })

    if (account) {
        return responseHandler({res: res, status: true, statusCode: 200, data: account })
    }

    return next(new ErrorResponse('Could not change alert status, please try again.', 500))
})

export const setAlertCategories = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let alertCategoryBody: AlertCategoryBody = alertCategoryBodyCast(req.body)

    let account: Account = await AccountModel.findByIdAndUpdate(user._id, { alertCategories: alertCategoryBody.categories })

    if (account) {
        return responseHandler({res: res, status: true, statusCode: 200, data: account })
    }

    return next(new ErrorResponse('Could not set alert category preference, please try again.', 500))
})

export const alertEmailHandler = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let emailResults: Array<EmailResult> = []

    let {
        page,
        limit
    } = req.query  

    console.log('len req', req.query)

    let alertEmailEligibleAccounts: Object = { hasActiveSubscription: true, alertStatus: true, $or: [{ alertRegions: { $exists: true, $ne: [] } }, { alertCategories: { $exists: true, $ne: [] } }] }

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), query: alertEmailEligibleAccounts, Schema: AccountModel })

    let accounts: Array<Account> = await AccountModel.find(alertEmailEligibleAccounts)
        .skip(paginationData.startIndex).limit(paginationData.limit)
    
    console.log('len', accounts.length)
    console.log('len e', accounts[0].email)
    let counter = 0

    accounts.forEach(async(e: Account, i: number) => {
        // call email sender module
        let [alertMailOptions, tenders, readCheckKey]: [MailOptions, Array<Tender>, number] = await alertEmail(e)

        if(tenders.length > 0) {
            let status: boolean = await sendAlertEmail(alertMailOptions)

            emailResults.push({
                account: e._id,
                tenders: tenders.map((e) => new mongoose.Types.ObjectId(e._id)),
                sentToEmail: e.email,
                type: EMAIL_TYPE_ALERT,
                readCheckKey: readCheckKey,
                isSent: status,
                isOpened: false,
                createdAt: new Date(Date.now())
            })
        }
        counter ++
        // when loop has ended
        if(counter == (accounts.length)) {
            let emailResultsResponse: Array<EmailResult> =  await EmailResultModel.insertMany(emailResults)

            return responseHandler({res: res, status: true, statusCode: 200, data: emailResultsResponse })
        }
    })
})