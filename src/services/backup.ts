import mongoose from 'mongoose';
import fs from 'fs'
import { Request, Response, NextFunction } from 'express';
import asyncHandler from "../middleware/async_handler"
import { CountryModel } from '../models/Country_Model';
import Country from '../interfaces/Country';
import { BACKUP_DIR } from '../config/statics.config';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import { LanguageModel } from '../models/Language_Model';
import Language from '../interfaces/Language';
import { RegionModel } from '../models/Region_Model';
import Region from '../interfaces/Region';
import { SubscriptionModel } from '../models/Subscription_Model';
import Subscription from '../interfaces/Subscription';
import { TenderSourceModel } from '../models/Tender_Source_Model';
import TenderSource from '../interfaces/Tender_Source';
import { TenderModel } from '../models/Tender_Model';
import Tender from '../interfaces/Tender';
import { AccountModel } from '../models/Account_Model';
import Account from '../interfaces/Account';
import { PaymentModel } from '../models/Payment_Model';
import Payment from '../interfaces/Payment';
import { PaymentMethodModel } from '../models/Payment_Method_Model';
import PaymentMethod from '../interfaces/Payment_Method';
import { SubscriptionPlanModel } from '../models/Subscription_Plan_Model';
import SubscriptionPlan from '../interfaces/Subscription_Plan';

export const backupAccounts = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let accounts: Array<Account> = await AccountModel.find()
    let backupTime: number = Date.now()
    
    if (accounts[0]) {
        try {
            fs.writeFile(`${BACKUP_DIR}/accounts/accounts-${backupTime}.json`, JSON.stringify(accounts), 'utf-8', function(err) {
                console.log(err)
            })

            return responseHandler({res: res, status: true, statusCode: 200, msg: `Backed up ${accounts.length} Account contents @${new Date(backupTime)}.` })

        } catch (e) {
            return responseHandler({res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Account contents.' })
        }
    }

    return next(new ErrorResponse('No Account content found for backup.', 404))
})

export const backupCountries = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let countries: Array<Country> = await CountryModel.find()
    let backupTime: number = Date.now()
    
    if (countries[0]) {
        try {
            fs.writeFile(`${BACKUP_DIR}/countries/countries-${backupTime}.json`, JSON.stringify(countries), 'utf-8', function(err) {
                console.log(err)
            })

            return responseHandler({res: res, status: true, statusCode: 200, msg: `Backed up ${countries.length} Country Contents @${new Date(backupTime)}.` })

        } catch (e) {
            return responseHandler({res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Country Contents.' })
        }
    }

    return next(new ErrorResponse('No Country content found for backup.', 404))
})

export const backupLanguages = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let languages: Array<Language> = await LanguageModel.find()
    let backupTime: number = Date.now()
    
    if (languages[0]) {
        try {
            fs.writeFile(`${BACKUP_DIR}/languages/languages-${backupTime}.json`, JSON.stringify(languages), 'utf-8', function(err) {
                console.log(err)
            })

            return responseHandler({res: res, status: true, statusCode: 200, msg: `Backed up ${languages.length} Language contents @${new Date(backupTime)}.` })

        } catch (e) {
            return responseHandler({res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Language contents.' })
        }
    }

    return next(new ErrorResponse('No Language content found for backup.', 404))
})

export const backupRegions = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let regions: Array<Region> = await RegionModel.find()
    let backupTime: number = Date.now()
    
    if (regions[0]) {
        try {
            fs.writeFile(`${BACKUP_DIR}/regions/regions-${backupTime}.json`, JSON.stringify(regions), 'utf-8', function(err) {
                console.log(err)
            })

            return responseHandler({res: res, status: true, statusCode: 200, msg: `Backed up ${regions.length} Region contents @${new Date(backupTime)}.` })

        } catch (e) {
            return responseHandler({res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Region contents.' })
        }
    }

    return next(new ErrorResponse('No Region content found for backup.', 404))
})

export const backupSubscriptions = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let subscriptions: Array<Subscription> = await SubscriptionModel.find()
    let backupTime: number = Date.now()
    
    if (subscriptions[0]) {
        try {
            fs.writeFile(`${BACKUP_DIR}/subscriptions/subscriptions-${backupTime}.json`, JSON.stringify(subscriptions), 'utf-8', function(err) {
                console.log(err)
            })

            return responseHandler({res: res, status: true, statusCode: 200, msg: `Backed up ${subscriptions.length} Subscription contents @${new Date(backupTime)}.` })

        } catch (e) {
            return responseHandler({res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Subscription contents.' })
        }
    }

    return next(new ErrorResponse('No Subscription content found for backup.', 404))
})

export const backupSubscriptionPlan = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let subscriptionPlans: Array<SubscriptionPlan> = await SubscriptionPlanModel.find()
    let backupTime: number = Date.now()
    
    if (subscriptionPlans[0]) {
        try {
            fs.writeFile(`${BACKUP_DIR}/subscription_plans/subscription_plans-${backupTime}.json`, JSON.stringify(subscriptionPlans), 'utf-8', function(err) {
                console.log(err)
            })

            return responseHandler({res: res, status: true, statusCode: 200, msg: `Backed up ${subscriptionPlans.length} Subscription Plan contents @${new Date(backupTime)}.` })

        } catch (e) {
            return responseHandler({res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Subscription Plan contents.' })
        }
    }

    return next(new ErrorResponse('No Subscription Plan content found for backup.', 404))
})

export const backupPayments = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let payments: Array<Payment> = await PaymentModel.find()
    let backupTime: number = Date.now()
    
    if (payments[0]) {
        try {
            fs.writeFile(`${BACKUP_DIR}/payments/payments-${backupTime}.json`, JSON.stringify(payments), 'utf-8', function(err) {
                console.log(err)
            })

            return responseHandler({res: res, status: true, statusCode: 200, msg: `Backed up ${payments.length} Payments contents @${new Date(backupTime)}.` })

        } catch (e) {
            return responseHandler({res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Payments contents.' })
        }
    }

    return next(new ErrorResponse('No Payments content found for backup.', 404))
})

export const backupPaymentMethods = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let paymentMethods: Array<PaymentMethod> = await PaymentMethodModel.find()
    let backupTime: number = Date.now()
    
    if (paymentMethods[0]) {
        try {
            fs.writeFile(`${BACKUP_DIR}/payment_methods/payment_methods-${backupTime}.json`, JSON.stringify(paymentMethods), 'utf-8', function(err) {
                console.log(err)
            })

            return responseHandler({res: res, status: true, statusCode: 200, msg: `Backed up ${paymentMethods.length} Payment Methods contents @${new Date(backupTime)}.` })

        } catch (e) {
            return responseHandler({res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Payment Methods contents.' })
        }
    }

    return next(new ErrorResponse('No Payment Methods content found for backup.', 404))
})

export const backupTenderSources = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let tenderSources: Array<TenderSource> = await TenderSourceModel.find()
    let backupTime: number = Date.now()
    
    if (tenderSources[0]) {
        try {
            fs.writeFile(`${BACKUP_DIR}/tender_sources/tenderSources-${backupTime}.json`, JSON.stringify(tenderSources), 'utf-8', function(err) {
                console.log(err)
            })

            return responseHandler({res: res, status: true, statusCode: 200, msg: `Backed up ${tenderSources.length} Tender Source contents @${new Date(backupTime)}.` })

        } catch (e) {
            return responseHandler({res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Tender Source contents.' })
        }
    }

    return next(new ErrorResponse('No Tender Source content found for backup.', 404))
})

export const backupTenders = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let tenders: Array<Tender> = await TenderModel.find()
    let backupTime: number = Date.now()
    
    if (tenders[0]) {
        try {
            fs.writeFile(`${BACKUP_DIR}/tenders/tenders-${backupTime}.json`, JSON.stringify(tenders), 'utf-8', function(err) {
                console.log(err)
            })

            return responseHandler({res: res, status: true, statusCode: 200, msg: `Backed up ${tenders.length} Tender contents @${new Date(backupTime)}.` })

        } catch (e) {
            return responseHandler({res: res, status: false, statusCode: 500, msg: 'Error! Could not backup Tender contents.' })
        }
    }

    return next(new ErrorResponse('No Tender content found for backup.', 404))
})