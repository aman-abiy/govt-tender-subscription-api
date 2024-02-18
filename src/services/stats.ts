import moment from "moment";
import asyncHandler from "../middleware/async_handler"
import { Request, Response, NextFunction } from 'express';
import { SalesCurrentMonth, SalesLast10DaysAmount, UsersByService, UsersBySubscriptionStatus, UsersLast10DaysCount } from "../utils/types/stats";
import { AccountModel } from "../models/Account_Model";
import { responseHandler } from "../utils/response_handler";
import ErrorResponse from "../utils/error_response";
import Account from "../interfaces/Account";
import { DAYS_OF_THE_WEEK, DEFAULT_LAST_X_DAYS_USER_STATS_FETCH } from "../config/statics.config";
import { PaymentModel } from "../models/Payment_Model";
import Payment from "../interfaces/Payment";

export const getUserCountBySubscriptionStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    let stats: UsersBySubscriptionStatus = {
        active: await AccountModel.countDocuments({ hasActiveSubscription: true, lastActiveSubscription: { $ne: null } }),
        pending: await AccountModel.countDocuments({ hasActiveSubscription: false, lastActiveSubscription: null, subscriptions: { $eq: [] } }),
        expired: await AccountModel.countDocuments({ hasActiveSubscription: false, lastActiveSubscription: { $ne: null }, subscriptions: { $ne: [] } }),
        total: await AccountModel.countDocuments()
    }
   
    if (stats) {
        return responseHandler({res: res, status: true, statusCode: 200, data: stats })
    }

    return next(new ErrorResponse('Could not get subscription status stats.', 500))

})

export const getUserCountByService = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    let stats: UsersByService = {
        mobileApp: await AccountModel.countDocuments({ mobileDeviceInfo: { $ne: null }}),
        webApp: await AccountModel.countDocuments({ mobileDeviceInfo: { $eq: null }})
    }
   
    if (stats) {
        return responseHandler({res: res, status: true, statusCode: 200, data: stats })
    }

    return next(new ErrorResponse('Could not get users count by service stats.', 500))

})


export const getLast10DaysUserCount = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    // get date and convert to ISO Date object
    const date: Date = new Date()
    const ISODate: String = date.toISOString()

    // date today
    let todaysDateString = ISODate.split(/\D+/);
    let today: Date = new Date(Date.UTC(parseInt(todaysDateString[0]), parseInt(todaysDateString[1]) - 1, parseInt(todaysDateString[2]), parseInt(todaysDateString[3]), parseInt(todaysDateString[4]), parseInt(todaysDateString[5]), parseInt(todaysDateString[6])))

    // date 30 days earlier
    let prior10DaysDateNum: number = new Date().setDate(date.getDate() - DEFAULT_LAST_X_DAYS_USER_STATS_FETCH);
    let prior10DaysISO: String = new Date(prior10DaysDateNum).toISOString()
    let prior10DaysString = prior10DaysISO.split(/\D+/);
    let prior10Days: Date = new Date(Date.UTC(parseInt(prior10DaysString[0]), parseInt(prior10DaysString[1]) - 1, parseInt(prior10DaysString[2]), parseInt(prior10DaysString[3]), parseInt(prior10DaysString[4]), parseInt(prior10DaysString[5]), parseInt(prior10DaysString[6])))

    console.log(today, prior10Days)

    let days: Array<String> = [];
    let counts: Array<number> = [];

    let accounts: Array<Account> = await AccountModel.find({ createdAt: { $gt: prior10Days, $lt: today } })
    console.log('accounts ', accounts.length)

    // let accountCreatedAts: Array<String> = accounts.map((e: Account) => e.createdAt.toISOString().split('T')[0])
    // console.log('accountCreatedAts ', accountCreatedAts)


    for (let day: number = 0; day < DEFAULT_LAST_X_DAYS_USER_STATS_FETCH; day++) {
        let priorDaysNum: number = new Date().setDate(date.getDate() - day);
        let priorDaysIso: String = new Date(priorDaysNum).toISOString()
        let priorDaysString = priorDaysIso.split(/\D+/);
        let priorDays: Date = new Date(Date.UTC(parseInt(priorDaysString[0]), parseInt(priorDaysString[1]) - 1, parseInt(priorDaysString[2]), parseInt(priorDaysString[3]), parseInt(priorDaysString[4]), parseInt(priorDaysString[5]), parseInt(priorDaysString[6])))
        
        let count: number = 0;

        for (let index in accounts) {
            if (accounts[index].createdAt.toISOString().split('T')[0] === priorDays.toISOString().split('T')[0]) {
                count++;
            }
        }

        days.push(DAYS_OF_THE_WEEK[new Date(new Date().setDate(date.getDate() - day)).getDay()])
        counts.push(count)
    }

    console.log(days.reverse())
    console.log(counts.reverse())


    let stats: UsersLast10DaysCount = {
        weekDays: days,
        counts: counts
    }
   
    if (stats) {
        return responseHandler({res: res, status: true, statusCode: 200, data: stats })
    }

    return next(new ErrorResponse('Could not get last 30 days user stats.', 500))

})

export const getLast10DaysSalesCount = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    // get date and convert to ISO Date object
    const date: Date = new Date()
    const ISODate: String = date.toISOString()

    // date today
    let todaysDateString = ISODate.split(/\D+/);
    let today: Date = new Date(Date.UTC(parseInt(todaysDateString[0]), parseInt(todaysDateString[1]) - 1, parseInt(todaysDateString[2]), parseInt(todaysDateString[3]), parseInt(todaysDateString[4]), parseInt(todaysDateString[5]), parseInt(todaysDateString[6])))

    // date 30 days earlier
    let prior10DaysDateNum: number = new Date().setDate(date.getDate() - DEFAULT_LAST_X_DAYS_USER_STATS_FETCH);
    let prior10DaysISO: String = new Date(prior10DaysDateNum).toISOString()
    let prior10DaysString = prior10DaysISO.split(/\D+/);
    let prior10Days: Date = new Date(Date.UTC(parseInt(prior10DaysString[0]), parseInt(prior10DaysString[1]) - 1, parseInt(prior10DaysString[2]), parseInt(prior10DaysString[3]), parseInt(prior10DaysString[4]), parseInt(prior10DaysString[5]), parseInt(prior10DaysString[6])))

    console.log(today, prior10Days)

    let days: Array<String> = [];
    let saleAmount: Array<number> = [];

    let payments: Array<Payment> = await PaymentModel.find({ createdAt: { $gt: prior10Days, $lt: today } })
    console.log('accounts ', payments.length)

    // let paymentCreatedAts: Array<String> = payments.map((e: Payment) => e.createdAt.toISOString().split('T')[0])
    // console.log('paymentCreatedAts ', paymentCreatedAts)


    for (let day: number = 0; day < DEFAULT_LAST_X_DAYS_USER_STATS_FETCH; day++) {
        let priorDaysNum: number = new Date().setDate(date.getDate() - day);
        let priorDaysIso: String = new Date(priorDaysNum).toISOString()
        let priorDaysString = priorDaysIso.split(/\D+/);
        let priorDays: Date = new Date(Date.UTC(parseInt(priorDaysString[0]), parseInt(priorDaysString[1]) - 1, parseInt(priorDaysString[2]), parseInt(priorDaysString[3]), parseInt(priorDaysString[4]), parseInt(priorDaysString[5]), parseInt(priorDaysString[6])))
        
        let amount: number = 0;

        for (let index in payments) {
            if (payments[index].createdAt.toISOString().split('T')[0] === priorDays.toISOString().split('T')[0]) {
                amount+= payments[index].price;
            }
        }

        days.push(DAYS_OF_THE_WEEK[new Date(new Date().setDate(date.getDate() - day)).getDay()])
        saleAmount.push(amount)
    }

    console.log(days.reverse())
    console.log(saleAmount.reverse())


    let stats: SalesLast10DaysAmount = {
        weekDays: days,
        saleAmountByDay: saleAmount
    }
   
    if (stats) {
        return responseHandler({res: res, status: true, statusCode: 200, data: stats })
    }

    return next(new ErrorResponse('Could not get last 30 days user stats.', 500))

})

export const getCurrentMonthSalesCount = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    // get date and convert to ISO Date object
    const startOfMonth = moment().clone().startOf('month').toDate();
    const endOfMonth = moment().clone().endOf('month').toDate();
    console.log(startOfMonth)
    console.log(endOfMonth)

    let payments: Array<Payment> = await PaymentModel.find({ price: { $gt: 0}, createdAt: { $gt: startOfMonth, $lt: endOfMonth } })
    console.log('payments ', payments.length)

    let totalAmount: number = 0;
    
    let stats: SalesCurrentMonth = {
        currentMonth: moment().format('MMMM'),
        count: payments.length,
        saleAmount: payments.reduce((prev, curr: Payment) => prev + curr.price, totalAmount)
    }
   
    if (stats) {
        return responseHandler({res: res, status: true, statusCode: 200, data: stats })
    }

    return next(new ErrorResponse('Could not get last 30 days user stats.', 500))

})

