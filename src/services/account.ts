import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/async_handler"
import Account from "../interfaces/Account";
import { RolePermission, AccountBody } from '../utils/types/method_return_dtos';
import { limitBelowSalesCoordinatorRoles } from "../utils/account_permission_walls";
import ErrorResponse from "../utils/error_response";
import { accountBodyCast } from '../utils/types/request_body_dtos';
import { hashPassword } from "../utils/password_hasher";
import { AccountModel } from "../models/Account_Model";
import { encryptVal } from "../utils/encryption";
import { SessionActivity } from "../utils/types/type_constants";
import { responseHandler } from "../utils/response_handler";
import { AccountQuery } from "../utils/types/request_query_dtos";
import { paginationHandler } from "../utils/pagination";

export const createAccount = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let rolePermission: RolePermission = limitBelowSalesCoordinatorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }
    let accountBody: AccountBody
    accountBody = accountBodyCast(req.body)
    accountBody.createdAt = new Date(Date.now())
    accountBody.createdBy = new mongoose.Types.ObjectId(user._id)
    
    console.log('accountBody', accountBody)

    let accounts: Array<Account> = await AccountModel.find({ $or: [{ email: accountBody.email }, { mobile: accountBody.mobile }] })

    if(accounts[0]) {
        return next(new ErrorResponse('An account with this email or mobile exists.', 409))
    }

    accountBody.password = await hashPassword(accountBody.password);

    let account: Account = await AccountModel.create(accountBody)

    if(account) {
        var sessionToken = encryptVal(account._id.toString())
        const sessionActivity: SessionActivity = {
            type: 'agent-created-account',
            timestamp: new Date(Date.now()),
            deviceInfo: accountBody.deviceInfo
        }

        account = await AccountModel.findByIdAndUpdate(account._id, { sessionToken, $push: { sessionActivity: sessionActivity } }, {
            new: true,
            runValidators: true
        })

        return responseHandler({ res: res, status: true, statusCode: 201, sessionToken, data: account })
    }

    return next(new ErrorResponse('Account could not be created. Try again.', 500))

})

export const editAccount = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let rolePermission: RolePermission = limitBelowSalesCoordinatorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let accountBody: AccountBody
    accountBody = accountBodyCast(req.body)

    let accounts: Array<Account> = await AccountModel.find({ $or: [{ email: accountBody.email }, { mobile: accountBody.mobile }] })

    if((accountBody.email != null || accountBody.mobile != null) && accounts[0] != null) {
        console.log(accountBody._id, accounts[0]._id)
        console.log(accountBody._id.equals(accounts[0]._id))
        if(!accountBody._id.equals(accounts[0]?._id)) {
            return next(new ErrorResponse('An account with this email or mobile exists.', 409))
        }
    }

    accountBody.password ? accountBody.password = await hashPassword(accountBody.password) : delete accountBody.password;
    accountBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    accountBody.lastUpdatedAt = new Date(Date.now())

    let account: Account = await AccountModel.findByIdAndUpdate(accountBody._id, { ...accountBody, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
        new: true,
        runValidators: true
    })

    if(account) {
        if(accountBody.password) { var sessionToken = encryptVal(account._id.toString()) }
        const sessionActivity: SessionActivity = {
            type: 'agent-updated-account',
            timestamp: new Date(Date.now()),
            deviceInfo: accountBody.deviceInfo
        }

        account = await AccountModel.findByIdAndUpdate(account._id, { ...(accountBody.password ? { sessionToken } : {}), $push: { sessionActivity: sessionActivity } }, {
            new: true,
            runValidators: true
        }).populate('alertRegions')
        .populate('alertCategories')
        .populate('alertCategories')
        .populate({ 
            path: 'bookmarks',
            populate: [
                {
                    path: 'createdBy',
                    select: { 'fname': 1 }
                }
            ] 
        })
        .populate({ 
            path: 'lastActiveSubscription',
            populate: [{
                    path: 'subscriptionPlan'
                },
                {
                    path: 'payment'
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
                        },
                        {
                            path: 'createdBy',
                            select: { 'fname': 1 }
                        }
                    ] 
                },
                {
                    path: 'createdBy',
                    select: { 'fname': 1 }
                }
            ] 
        })
        .populate({
            path: 'createdBy',
            select: { 'fname': 1 }
        })
        .populate({
            path: 'lastUpdatedBy',
            select: { 'fname': 1 }
        })

        return responseHandler({ res: res, status: true, statusCode: 200, sessionToken, data: account })
    }

    return next(new ErrorResponse('Account could not be updated. Try again.', 500))

})

export const editOwnAccount = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    console.log('req.body', req.body)
    let accountBody: AccountBody
    accountBody = accountBodyCast(req.body)
    delete accountBody._id

    let accounts: Array<Account> = await AccountModel.find({ $or: [{ email: accountBody.email }, { mobile: accountBody.mobile }] })

    if(accounts[0]) {
        return next(new ErrorResponse('An account with this email or mobile exists. Please use a different email or mobile and try again.', 409))
    }
    
    accountBody.password ? accountBody.password = await hashPassword(accountBody.password) : delete accountBody.password;
    accountBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    accountBody.lastUpdatedAt = new Date(Date.now())

   let account: Account = await AccountModel.findByIdAndUpdate(user._id, { ...accountBody, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id })

    if(account) {
        if(accountBody.password) { var sessionToken = encryptVal(account._id.toString()) }
        const sessionActivity: SessionActivity = {
            type: 'updated-account',
            timestamp: new Date(Date.now()),
            deviceInfo: accountBody.deviceInfo
        }

        account = await AccountModel.findByIdAndUpdate(account._id, { ...(accountBody.password ? { sessionToken } : {}), $push: { sessionActivity: sessionActivity } }, {
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

        return responseHandler({ res: res, status: true, statusCode: 200, data: account })
    }

    return next(new ErrorResponse('Account could not be updated. Try again.', 500))

})

export const toggleActiveStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let rolePermission: RolePermission = limitBelowSalesCoordinatorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let accountBody: AccountBody
    accountBody = accountBodyCast(req.body)

    accountBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    accountBody.lastUpdatedAt = new Date(Date.now())

    let account: Account = await AccountModel.findById(accountBody._id)

    if(account) {
        account = await AccountModel.findByIdAndUpdate(accountBody._id, { isActive: !account.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id })

        if(account) {
            const sessionActivity: SessionActivity = {
                type: 'agent-updated-account',
                timestamp: new Date(Date.now()),
                deviceInfo: accountBody.deviceInfo
            }
    
            account = await AccountModel.findByIdAndUpdate(account._id, { $push: { sessionActivity: sessionActivity } }, {
                new: true,
                runValidators: true
            })
    
            return responseHandler({ res: res, status: true, statusCode: 200, data: account })
        }
    
        return next(new ErrorResponse('Account could not be deleted. Try again.', 500))
    }
    
    return next(new ErrorResponse('Account not found. Try again.', 404))

})

export const toggleDelete = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let rolePermission: RolePermission = limitBelowSalesCoordinatorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let accountBody: AccountBody
    accountBody = accountBodyCast(req.body)

    accountBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    accountBody.lastUpdatedAt = new Date(Date.now())

    let account: Account = await AccountModel.findById(accountBody._id)

    if(account) {
        account = await AccountModel.findByIdAndUpdate(accountBody._id, { isDeleted: !account.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id })

        if(account) {
            const sessionActivity: SessionActivity = {
                type: 'agent-deleted-account',
                timestamp: new Date(Date.now()),
                deviceInfo: accountBody.deviceInfo
            }

            account = await AccountModel.findByIdAndUpdate(account._id, { $push: { sessionActivity: sessionActivity } }, {
                new: true,
                runValidators: true
            })

            return responseHandler({ res: res, status: true, statusCode: 200, data: account })
        }

        return next(new ErrorResponse('Account could not be deleted. Try again.', 500))
    }

    return next(new ErrorResponse('Account not found. Try again.', 404))

})

export const getAccount = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let rolePermission: RolePermission = limitBelowSalesCoordinatorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let {
        _id,
        fname,
        lname,
        email,
        mobile,
        company,
        roles,
        hasActiveSubscription,
        lastActiveSubscription,
        alertStatus,
        isActive,
        selectFields,
        isDeleted,
        createdBy,
        createdAt,
        sort,
        page,
        limit
    } = req.query  
    console.log('req.query U', req.query)
    let accountQuery: AccountQuery = {} as AccountQuery

    accountQuery.isDeleted = false

    if (_id) {
        accountQuery._id = new mongoose.Types.ObjectId(_id.toString())
    }

    if (fname != null) {
        accountQuery.fname = { "$regex": fname.toString(), "$options": "i" };
    }
 
    if (lname != null) {
        accountQuery.lname = { "$regex": fname.toString(), "$options": "i" };
    }

    if (email != null) {
        accountQuery.email = { "$regex": email.toString(), "$options": "i" };
    }

    // if (mobile != null) {
    //     accountQuery.mobile.e164 = { 'mobile.e164': { "$regex": mobile.toString(), "$options": "i" } };
    // }

    if (company) {
        accountQuery.company = new mongoose.Types.ObjectId(company.toString())
    }

    if (roles != null) {
        accountQuery.roles = { "$in": JSON.parse(JSON.stringify(roles)) }
    }

    if (selectFields != null) {
        selectFields = JSON.parse(selectFields.toString());
        // selectFields = JSON.parse(JSON.stringify(selectFields.toString()));
    }

    if (hasActiveSubscription != null) {
        accountQuery.hasActiveSubscription = (hasActiveSubscription == 'true' ? true : false);
    }

    if (lastActiveSubscription != null) {
        accountQuery.lastActiveSubscription = JSON.parse(lastActiveSubscription.toString());
    }

    if (alertStatus != null) {
        accountQuery.alertStatus = (alertStatus == 'true' ? true : false);
    }

    if (isActive != null) {
        accountQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        accountQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        accountQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        accountQuery.createdAt = new Date(createdAt.toString())
    }

    console.log('accountQuery U', accountQuery)


    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), query: accountQuery, Schema: AccountModel })

    const accounts: Array<Account> = await AccountModel.find({...accountQuery, ...(mobile != null ? { 'mobile.e164': { "$regex": (mobile.toString()).replace('+', ''), "$options": "i" }} : {})}, { sessionActivity: { $slice: -20 } }).select('+sessionActivity').select(selectFields).sort(sort)
        .populate('alertRegions')
        .populate('alertCategories')
        .populate('alertCategories')
        .populate({ 
            path: 'bookmarks',
            populate: [
                {
                    path: 'createdBy',
                    select: { 'fname': 1 }
                }
            ] 
        })
        .populate({ 
            path: 'lastActiveSubscription',
            populate: [{
                    path: 'subscriptionPlan'
                },
                {
                    path: 'payment'
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
                            path: 'paymentMethod',
                        },
                        {
                            path: 'currency'
                        },
                        {
                            path: 'bank'
                        },
                        {
                            path: 'createdBy',
                            select: { 'fname': 1 }
                        }
                    ] 
                },
                {
                    path: 'createdBy',
                    select: { 'fname': 1 }
                }
            ] 
        })
        .populate({
            path: 'createdBy',
            select: { 'fname': 1 }
        })
        .populate({
            path: 'lastUpdatedBy',
            select: { '_id': 1, 'fname': 1 }
        })
        .skip(paginationData.startIndex).limit(paginationData.limit).lean();

    if(accounts)  {
        return responseHandler({res: res, status: true, statusCode: 200, data: accounts, metaData: paginationData })
    }

    return next(new ErrorResponse('No User found.', 404))

})

// updates changes by constantly sending an updated state of the logged in users account
export const getAuthAccount = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let account: Account = await AccountModel.findById(user._id)
        .populate({ 
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

    if(account) {
        return responseHandler({res: res, status: true, statusCode: 200, data: account })
    }

    return next(new ErrorResponse('Authentication error, please login.', 401))
})
 