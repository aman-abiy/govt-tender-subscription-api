import mongoose from 'mongoose';
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler'
import { AccountModel } from '../models/Account_Model';
import { hashPassword } from '../utils/password_hasher';
import ErrorResponse from '../utils/error_response';
import { encryptVal } from '../utils/encryption';
import { generateToken } from '../utils/token_generator';
import { passwordResetEmail, emailVerification, welcomeEmail } from '../config/email_formats.config';
import { sendAuthEmail } from '../subscribers/email_sender';
import { sendSMS } from '../utils/sms_sender';
import { verifyAccountSMS } from "../config/sms_formats.config";
import Account from '../interfaces/Account';
import { extendDateTime } from '../utils/functions';
import bcrypt from 'bcryptjs';
import { responseHandler } from '../utils/response_handler';
import { AccountBody, MailOptions } from '../utils/types/method_return_dtos';
import { accountBodyCast } from '../utils/types/request_body_dtos';
import { SessionActivity } from '../utils/types/type_constants';
import { generatePasswordResetLink, generateVerificationLink } from '../utils/url_generator';

export const signup = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let accountBody: AccountBody
    accountBody = accountBodyCast(req.body)
    accountBody.createdAt = new Date(Date.now())
    accountBody.createdBy = null
    
    let accounts: Array<Account> = (await AccountModel.find({ $or: [{ email: accountBody.email }, { mobile: accountBody.mobile }] }))

    if(accounts[0]) {
        return next(new ErrorResponse('An account with this email or mobile exists.', 409))
    }

    let account : Account

    accountBody.password = await hashPassword(accountBody.password);
    account = await AccountModel.create(accountBody)
    
    if(account) {
        // send welcome email with verification link
        let verificationToken: string = generateToken()
        let verificationLink: URL = generateVerificationLink(verificationToken)

        let emailOptions : MailOptions = welcomeEmail(account, verificationLink)
        await sendAuthEmail(emailOptions)


        var sessionToken = encryptVal(account._id.toString())
        const sessionActivity: SessionActivity = {
            type: 'signup',
            timestamp: new Date(Date.now()),
            deviceInfo: accountBody.deviceInfo
        }

        account = await AccountModel.findByIdAndUpdate(account._id, { sessionToken, $push: { sessionActivity: sessionActivity }, ...(accountBody.mobileDeviceInfo != null ? { mobileDeviceInfo: accountBody.mobileDeviceInfo } : null) }, {
            new: true,
            runValidators: true
        }).populate({ 
            path: 'lastActiveSubscription',
            populate: [{
                    path: 'subscriptionPlan'
                },
                {
                    path: 'payment',
                    populate: [{
                            path: 'paymentMethod'
                        },
                        {
                            path: 'currency'
                        },
                        {
                            path: 'bank'
                        }
                    ] 
                }
            ] 
        })
        .populate({ 
            path: 'pendingSubscription',
            populate: [{
                    path: 'subscriptionPlan'
                },
                {
                    path: 'payment',
                    populate: [{
                            path: 'paymentMethod'
                        },
                        {
                            path: 'currency'
                        },
                        {
                            path: 'bank'
                        }
                    ] 
                }
            ] 
        })
        .populate({ 
            path: 'subscriptions',
            populate: [{
                    path: 'subscriptionPlan'
                },
                {
                    path: 'payment',
                    populate: [{
                            path: 'paymentMethod'
                        },
                        {
                            path: 'currency'
                        },
                        {
                            path: 'bank'
                        }
                    ] 
                }
            ] 
        })


        return responseHandler({ res: res, status: true, statusCode: 201, sessionToken, data: account })
    }

    return next(new ErrorResponse('Account could not be created. Try again.', 500))


})

export const login = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let accountBody: AccountBody
    accountBody = accountBodyCast(req.body)

    let accounts: Array<Account> = (await AccountModel.find({ $or: [{ email: accountBody.email }, { 'mobile.e164': accountBody.mobile }] }).select('+password'))

    if(accounts[0]) {
        let account : Account = accounts[0]
        console.log(accountBody.password, account.email)
        const isMatched = await bcrypt.compare(accountBody.password, account.password);

        if(isMatched) {
            var sessionToken = encryptVal(account._id.toString())
            const sessionActivity: SessionActivity = {
                type: 'login',
                timestamp: new Date(Date.now()),
                deviceInfo: accountBody.deviceInfo
            }
    
            account = await AccountModel.findByIdAndUpdate(account._id, { sessionToken, $push: { sessionActivity: sessionActivity }, ...(accountBody.mobileDeviceInfo != null ? { mobileDeviceInfo: accountBody.mobileDeviceInfo } : null) }, {
                new: true,
                runValidators: true
            }).populate({ 
                path: 'lastActiveSubscription',
                populate: [{
                        path: 'subscriptionPlan'
                    },
                    {
                        path: 'payment',
                        populate: [{
                                path: 'paymentMethod'
                            },
                            {
                                path: 'currency'
                            },
                            {
                                path: 'bank'
                            }
                        ] 
                    }
                ] 
            })
            .populate({ 
                path: 'pendingSubscription',
                populate: [{
                        path: 'subscriptionPlan'
                    },
                    {
                        path: 'payment',
                        populate: [{
                                path: 'paymentMethod'
                            },
                            {
                                path: 'currency'
                            },
                            {
                                path: 'bank'
                            }
                        ] 
                    }
                ] 
            })
            .populate({ 
                path: 'subscriptions',
                populate: [{
                        path: 'subscriptionPlan'
                    },
                    {
                        path: 'payment',
                        populate: [{
                                path: 'paymentMethod'
                            },
                            {
                                path: 'currency'
                            },
                            {
                                path: 'bank'
                            }
                        ] 
                    }
                ] 
            })
    
            return responseHandler({ res: res, status: true, statusCode: 200, sessionToken, data: account })

        }
        return next(new ErrorResponse('Password is incorrect.', 401))
        
    }

    return next(new ErrorResponse('Account not found.', 404))

})

export const logout = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user
    console.log(user)
    let accountBody: AccountBody
    accountBody = accountBodyCast(req.body)

    const sessionActivity: SessionActivity = {
        type: 'logout',
        timestamp: new Date(Date.now()),
        deviceInfo: accountBody.deviceInfo
    }

    let account: Account = await AccountModel.findByIdAndUpdate(user._id, { $push: { sessionActivity: sessionActivity } })

    if(account) {
        return responseHandler({res: res, status: true, statusCode: 200, data: account })
    }

    return next(new ErrorResponse('Authentication error, please try again.', 401))

})

export const requestEmailVerification = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let accountBody: AccountBody
    accountBody = accountBodyCast(req.body)

    let accounts : Array<Account> = (await AccountModel.find({ email: accountBody.email }))

    if(accounts[0]) {
        let account : Account = accounts[0]

        if(!account.isVerified) {

            let verificationToken: string = generateToken()
            let verificationLink: URL = generateVerificationLink(verificationToken)

            let emailOptions : MailOptions = emailVerification(account, verificationLink)
            await sendAuthEmail(emailOptions)

            const sessionActivity: SessionActivity = {
                type: 'email-verification-request',
                timestamp: new Date(Date.now()),
                deviceInfo: accountBody.deviceInfo
            }

            account = await AccountModel.findByIdAndUpdate(account._id, { verificationToken, $push: { sessionActivity: sessionActivity } }, {
                new: true,
                runValidators: true
            })

            return responseHandler({ res: res, status: true, statusCode: 200, link: verificationLink })
        }

        return next(new ErrorResponse('Your account is already verified.', 409))
    }

    return next(new ErrorResponse('Account not found.', 404))

})

export const verifyEmail = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let { verificationToken, deviceInfo } = req.body

    let accounts : Array<Account> = (await AccountModel.find({ verificationToken }))

    if(accounts[0]) {
        let account : Account = accounts[0]

        if(!account.isVerified) {

            const sessionActivity: SessionActivity = {
                type: 'email-verified',
                timestamp: new Date(Date.now()),
                deviceInfo
            }

            account = await AccountModel.findByIdAndUpdate(account._id, { isVerified: true, $push: { sessionActivity: sessionActivity } }, {
                new: true,
                runValidators: true
            })

            return responseHandler({ res: res, status: true, statusCode: 200 })
        }

        return next(new ErrorResponse('Your account is already verified.', 409))
    }

    return next(new ErrorResponse('Account not found, please make sure the verification link is correct.', 404))
})

export const requestPasswordReset = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let { email, mobile, deviceInfo } = req.body

    let accountBody: AccountBody
    accountBody = accountBodyCast(req.body)

    let accounts : Array<Account> = (await AccountModel.find({ $or: [{ email: accountBody.email }, { mobile: accountBody.mobile }] }).select('+passwordResetToken'))

    if(accounts[0]) {
        let account : Account = accounts[0]

        let passwordResetToken: string = generateToken()
        let passwordResetLink: URL = generatePasswordResetLink(passwordResetToken)

        let status: boolean;
        if (email) {

            let emailOptions : MailOptions = passwordResetEmail(account, passwordResetLink)
            status = await sendAuthEmail(emailOptions)

        } else if (mobile) {

            let smsBody = verifyAccountSMS(account, passwordResetLink)
            status = await sendSMS(smsBody, account.email)

        }

        if (status) {
            const sessionActivity: SessionActivity = {
                type: 'reset-password-request',
                timestamp: new Date(Date.now()),
                deviceInfo: accountBody.deviceInfo
            }

            // expires after 1 hour
            const passwordResetExpiryAt : Date = extendDateTime(new Date(Date.now()), {hours: 1, minutes: 0, seconds: 0})
            
            account = await AccountModel.findByIdAndUpdate(account._id, { passwordResetToken, passwordResetExpiryAt, $push: { sessionActivity: sessionActivity } }, {
                new: true,
                runValidators: true
            })

            return responseHandler({ res: res, status: true, statusCode: 200, link: passwordResetLink, data: account })
        }

        return next(new ErrorResponse('Could not send password reset link, try again.', 502))
        
    }

    return next(new ErrorResponse('Account not found.', 404))
})

export const resetPassword = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let { passwordResetToken, newPassword, deviceInfo } = req.body

    console.log(req.body)
    let accounts : Array<Account> = await AccountModel.find({ passwordResetToken })
    if(accounts[0]) {

        let account : Account = accounts[0]

        if(account.passwordResetExpiryAt.getTime() >= Date.now()) {
            const sessionActivity: SessionActivity = {
                type: 'reset-password',
                timestamp: new Date(Date.now()),
                deviceInfo: deviceInfo
            }

            newPassword = await hashPassword(newPassword);

            account = await AccountModel.findByIdAndUpdate(account._id, { password: newPassword, passwordResetExpiryAt: Date.now(), $push: { sessionActivity: sessionActivity } }, {
                new: true,
                runValidators: true
            })

            return responseHandler({ res: res, status: true, statusCode: 200, data: account })
        }
        
        return next(new ErrorResponse('Password reset link has expired or been used.', 409))
    }

    return next(new ErrorResponse('Account not found, please make sure the password reset link is correct.', 404))
})