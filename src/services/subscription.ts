import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import { calculateSubscriptionEndDate } from '../utils/subscription_duration_calc'
import Account from '../interfaces/Account';
import Payment from '../interfaces/Payment';
import Subscription from '../interfaces/Subscription';
import { PaymentModel } from '../models/Payment_Model';
import { SubscriptionModel } from '../models/Subscription_Model';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import { generateInvoice } from '../utils/invoice_generator';
import { SubscriptionDates } from '../utils/types/type_constants';
import { SubscriptionQuery } from '../utils/types/request_query_dtos';
import { subscriptionBodyCast } from '../utils/types/request_body_dtos'
import { InvoiceReturn, RolePermission, SubscriptionBody } from '../utils/types/method_return_dtos';
import { paginationHandler } from '../utils/pagination';
import { AccountModel } from '../models/Account_Model';
import { sort } from '../utils/types/enums';
import { SubscriptionPlanModel } from "../models/Subscription_Plan_Model";
import SubscriptionPlan from '../interfaces/Subscription_Plan'
import { limitBelowSalesCoordinatorRoles } from "../utils/account_permission_walls";

export const addSubscription = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowSalesCoordinatorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let subscriptionBody: SubscriptionBody
    subscriptionBody = subscriptionBodyCast(req.body)

    let subscriptionAccount = await AccountModel.findById(subscriptionBody.account)

    if (!subscriptionAccount.hasActiveSubscription) {
        let subscriptionPlan: SubscriptionPlan = await SubscriptionPlanModel.findById(subscriptionBody.subscriptionPlan)
        let subscriptionDates: SubscriptionDates = calculateSubscriptionEndDate(subscriptionPlan, subscriptionBody.startDate)

        subscriptionBody.startDate = subscriptionDates.startDate
        subscriptionBody.endDate = subscriptionDates.endDate

        let paymentObject = {
            isPaid: subscriptionBody.isPaid,
            price: subscriptionPlan.totalPrice,
            paymentMethod: subscriptionBody.paymentMethod,
            bank: subscriptionBody.bank,
            currency: subscriptionBody.currency,
            paymentDate: subscriptionBody.paymentDate,
            transactionRef: subscriptionBody.transactionRef,
            createdAt: new Date(Date.now()),
            createdBy: user._id
        }

        let invoiceObj: InvoiceReturn = await generateInvoice(subscriptionPlan, subscriptionBody.paymentDate)

        delete subscriptionBody.isPaid
        delete subscriptionBody.paymentMethod
        delete subscriptionBody.currency
        delete subscriptionBody.transactionRef

        // delete this or will default _id to null
        delete subscriptionBody._id
        
        subscriptionBody.createdAt = new Date(Date.now())
        subscriptionBody.createdBy = user._id

        let payment: Payment = await PaymentModel.create(paymentObject)

        if(payment) {
            subscriptionBody.payment = payment._id
            subscriptionBody.invoiceId = invoiceObj.invoiceId
            subscriptionBody.invoicePDF = invoiceObj.fileName

            let subscription: Subscription = await SubscriptionModel.create(subscriptionBody)
            console.log('subscription._id ', subscription)
            if(subscription) {
                payment = await PaymentModel.findByIdAndUpdate(payment._id, { subscription: subscription._id })
                await AccountModel.findByIdAndUpdate(subscriptionBody.account, { lastActiveSubscription: subscription._id, hasActiveSubscription: true, $push: { subscriptions: subscription._id } })
                return responseHandler({res: res, status: true, statusCode: 201, data: subscription })
            }
            await PaymentModel.findByIdAndDelete(payment._id)
            return next(new ErrorResponse('Could not create Subscription.', 500))
        }
        return next(new ErrorResponse('Could not register Payment details.', 500))
    }

    return next(new ErrorResponse('There is already an active subscription for this account.', 409))
      
})

export const addPendingSubscription = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowSalesCoordinatorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let subscriptionBody: SubscriptionBody
    subscriptionBody = subscriptionBodyCast(req.body)

    let subscriptionAccount = await AccountModel.findById(subscriptionBody.account).populate<{ lastActiveSubscription: Subscription }>('lastActiveSubscription')

    // only add pending subscription if account has an active subscription
    if (subscriptionAccount.hasActiveSubscription) {
        let startDate: Date = (subscriptionAccount.lastActiveSubscription as Subscription | null).endDate

        let subscriptionPlan: SubscriptionPlan = await SubscriptionPlanModel.findById(subscriptionBody.subscriptionPlan)
        let subscriptionDates: SubscriptionDates = calculateSubscriptionEndDate(subscriptionPlan, startDate)
        subscriptionBody.startDate = subscriptionDates.startDate
        subscriptionBody.endDate = subscriptionDates.endDate

        let paymentObject = {
            isPaid: subscriptionBody.isPaid,
            price: subscriptionPlan.totalPrice,
            paymentMethod: subscriptionBody.paymentMethod,
            bank: subscriptionBody.bank,
            currency: subscriptionBody.currency,
            paymentDate: subscriptionBody.paymentDate,
            transactionRef: subscriptionBody.transactionRef,
            createdAt: new Date(Date.now()),
            createdBy: user._id
        }

        let invoiceObj: InvoiceReturn = await generateInvoice(subscriptionPlan, subscriptionBody.paymentDate)

        delete subscriptionBody.isPaid
        delete subscriptionBody.paymentMethod
        delete subscriptionBody.currency
        delete subscriptionBody.paymentDate
        delete subscriptionBody.transactionRef

        subscriptionBody.isPending = true
        subscriptionBody.isActive = false
        subscriptionBody.createdAt = new Date(Date.now())
        subscriptionBody.createdBy = user._id

        let payment: Payment = await PaymentModel.create(paymentObject)

        if(payment) {
            subscriptionBody.payment = payment._id
            subscriptionBody.invoiceId = invoiceObj.invoiceId
            subscriptionBody.invoicePDF = invoiceObj.fileName

            let subscription: Subscription = await SubscriptionModel.create(subscriptionBody)
            
            console.log('subscription._id', subscription)
            if(subscription) {
                payment = await PaymentModel.findByIdAndUpdate(payment._id, { subscription: subscription._id })
                await AccountModel.findByIdAndUpdate(subscriptionBody.account, { pendingSubscription: subscription._id, $push: { subscriptions: subscription._id } })
                return responseHandler({res: res, status: true, statusCode: 201, data: subscription })
            }
            return next(new ErrorResponse('Could not create Subscription.', 500))
        }
        return next(new ErrorResponse('Could not register Payment details.', 500))
    }

    return next(new ErrorResponse('There is no active subscription for this account, add a subscription before a pending subscription.', 409))
      
})

export const editSubscription = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowSalesCoordinatorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let subscriptionBody: SubscriptionBody
    subscriptionBody = subscriptionBodyCast(req.body)

    let subscriptionPlan: SubscriptionPlan = await SubscriptionPlanModel.findById(subscriptionBody.subscriptionPlan)
    let subscription: Subscription = await SubscriptionModel.findById(subscriptionBody._id)

    // doesn't work properly
    if(subscriptionBody.startDate.getTime() !== subscription.startDate.getTime()) {
        let subscriptionDates: SubscriptionDates = calculateSubscriptionEndDate(subscriptionPlan, subscriptionBody.startDate)
        subscriptionBody.startDate = subscriptionDates.startDate
        subscriptionBody.endDate = subscriptionDates.endDate
    }

    // .populate<{ payment: Payment }>('payment')
    // let paymentObject = (subscription.payment as Payment | null)
    
    let paymentObject =  {
        isPaid: subscriptionBody.isPaid,
        price: subscriptionPlan.totalPrice,
        paymentMethod: subscriptionBody.paymentMethod,
        bank: subscriptionBody.bank,
        currency: subscriptionBody.currency,
        paymentDate: subscriptionBody.paymentDate,
        transactionRef: subscriptionBody.transactionRef
    }

    let invoiceObj: InvoiceReturn = await generateInvoice(subscriptionPlan, subscriptionBody.paymentDate)

    delete subscriptionBody.isPaid
    delete subscriptionBody.paymentMethod
    delete subscriptionBody.currency
    delete subscriptionBody.paymentDate
    delete subscriptionBody.transactionRef

    subscriptionBody.lastUpdatedBy = user._id

    let payment: Payment = await PaymentModel.findByIdAndUpdate(subscription.payment, paymentObject)

    if(payment) {

        subscriptionBody.payment = payment._id
        subscriptionBody.invoiceId = invoiceObj.invoiceId
        subscriptionBody.invoicePDF = invoiceObj.fileName
        
        subscription = await SubscriptionModel.findByIdAndUpdate(subscription._id, subscriptionBody, {
            new: true,
            runValidators: true
        })
         
        if(subscription) {
            return responseHandler({res: res, status: true, statusCode: 201, data: subscription })
        } 
        return next(new ErrorResponse('Could not update Subscription.', 500))
    }
    return next(new ErrorResponse('Could not update Payment details.', 500))
})

export const deleteSubscription = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowSalesCoordinatorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let subscriptionBody: SubscriptionBody
    subscriptionBody = subscriptionBodyCast(req.body)

    let subscription: Subscription = await SubscriptionModel.findById(subscriptionBody._id)
    
    if (subscription) {
        subscription = await SubscriptionModel.findByIdAndUpdate(subscriptionBody._id, { isDeleted: true }, {
            new: true,
            runValidators: true
        })
        await PaymentModel.findByIdAndUpdate(subscription.payment, { isDeleted: true })

        if (subscription) {
            return responseHandler({res: res, status: true, statusCode: 200, data: subscription })
        }

        return next(new ErrorResponse('Could not delete Subscription, please try again.', 500))
    }
    return next(new ErrorResponse('Subscription could not be found.', 404))

})

export const getSubscription = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowSalesCoordinatorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }
    
    let {
        _id,
        account,
        subscriptionPlan,
        startDate,
        endDate,
        isActive,
        isDeleted,
        createdBy,
        createdAt,
        sort,
        page, 
        limit
    } = req.query

    let subscriptionQuery : SubscriptionQuery = {} as SubscriptionQuery
    subscriptionQuery.isDeleted = false

    if (_id) {
        subscriptionQuery._id = new mongoose.Types.ObjectId(_id.toString())
    }

    if (account) {
        subscriptionQuery.account = new mongoose.Types.ObjectId(account.toString())
    }

    if (startDate) {
        subscriptionQuery.startDate = new Date(startDate.toString())
    }

    if (endDate) {
        subscriptionQuery.endDate = new Date(endDate.toString())
    }

    if (subscriptionPlan) {
        subscriptionQuery.subscriptionPlan = new mongoose.Types.ObjectId(subscriptionPlan.toString())
    }

    if (isActive) {
        subscriptionQuery.isActive
    }

    if (isDeleted) {
        subscriptionQuery.isDeleted
    }

    if (createdBy) {
        subscriptionQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        subscriptionQuery.createdAt = new Date(createdAt.toString())
    }

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), query: subscriptionQuery, Schema: SubscriptionModel })

    let subscription: Array<Subscription> = await SubscriptionModel.find(subscriptionQuery).sort(sort)
        .populate('account')
        .populate('subscriptionPlan')
        .populate({ 
            path: 'payment',
            populate: [{
                    path: 'paymentMethod'
                },
                {
                    path: 'bank'
                },
                {
                    path: 'currency'
                }
            ] 
        }).skip(paginationData.startIndex).limit(paginationData.limit).lean();

    if(subscription[0]) {
        return responseHandler({res: res, status: true, statusCode: 200, data: subscription, metaData: paginationData })
    }

    return next(new ErrorResponse('No Subscription found.', 404))

})

// closes expired subscriptions and opens if any pending subscription exists
export const handleExpiredAndPendingSubscriptions = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    // select subscription with endDate equal to a day before today
    let date: Date = new Date(Date.now())
    date.setUTCHours(0, 0, 1, 0)
    console.log('date 1', date)
    date.setDate(date.getDate() + 1)
    console.log('date 2', date)

    let subscriptions: Array<Subscription> = await SubscriptionModel.find({ endDate: { $lte: date }, isActive: true }).populate('account')

    console.log('subscriptions', subscriptions, date.getMilliseconds())
    if(subscriptions[0]) {
        subscriptions.forEach(async(e: Subscription) => {
            let account = (e.account as Account | null)
            if(account.pendingSubscription) {
                await Promise.all([
                    // set the accounts pending subscription as the active subscription
                    await AccountModel.findByIdAndUpdate(account._id, { lastActiveSubscription: account.pendingSubscription, pendingSubscription: null, hasActiveSubscription: true }),
                    // disable the expired subscription
                    await SubscriptionModel.findByIdAndUpdate(account.lastActiveSubscription, { isActive: false, }),
                    // set the pending subscription as active
                    await SubscriptionModel.findByIdAndUpdate(account.pendingSubscription, { isPending: false, isActive: true, })
                ])
            } else {
                await Promise.all([
                    // set the account as having no active subscription and kill session
                    await AccountModel.findByIdAndUpdate(account._id, { hasActiveSubscription: false, pendingSubscription: null }),
                    // disable the expired subscription
                    await SubscriptionModel.findByIdAndUpdate(account.lastActiveSubscription, { isActive: false, })
                ])
            }
        })

        return responseHandler({res: res, status: true, statusCode: 200, msg: `Closed ${subscriptions.length} subscriptions.` })

    }

    return next(new ErrorResponse('No Subscription expiring today found.', 404))

})

