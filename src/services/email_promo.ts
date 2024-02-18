
import mongoose from 'mongoose';
import fs from 'fs'
import { Request, Response, NextFunction } from 'express';
import asyncHandler from "../middleware/async_handler"
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import { promoEmail } from '../config/email_formats.config';
import { MailOptions } from '../utils/types/method_return_dtos';
import { sendPromoEmail } from '../subscribers/email_sender';
import { EmailPromoQuery } from '../utils/types/request_query_dtos';

export const sendEmail = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let {
        startIndex,
        endIndex
    } = req.query

    let emailPromoQuery: EmailPromoQuery = {} as EmailPromoQuery
    
    if (startIndex) {
        emailPromoQuery.startIndex = parseInt(startIndex.toString())
    }

    if (endIndex) {
        emailPromoQuery.endIndex = parseInt(endIndex.toString())
    }

    // let json: Array<string> = require('../utils/promo_emails/emails-1.json');
    let json: Array<string> = require('../utils/promo_emails/all_emails.json');

    let emailListSegment : Array<string> = json.slice(emailPromoQuery.startIndex, emailPromoQuery.endIndex)

    console.log(emailListSegment.length)

    emailListSegment.forEach(async(obj: any) => {
        console.log('obj.email', obj.email)
        let promoMailOptions: MailOptions = promoEmail(obj.email)
        // console.log('promoMailOptions', promoMailOptions)

        let status: boolean = await sendPromoEmail(promoMailOptions)
    })

    return responseHandler({res: res, status: false, statusCode: 200, msg: 'Promo Email Sent.' })

    
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
})