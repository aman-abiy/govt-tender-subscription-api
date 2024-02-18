import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/async_handler';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import Account from '../interfaces/Account';
import { RolePermission, SubscriptionPlanBody } from '../utils/types/method_return_dtos';
import { limitBelowAdminRoles } from '../utils/account_permission_walls';
import { SubscriptionPlanModel } from '../models/Subscription_Plan_Model';
import SubscriptionPlan from '../interfaces/Subscription_Plan';
import { subscriptionPlanBodyCast } from '../utils/types/request_body_dtos';
import { calculateVat } from '../utils/vat_calculator';
import { VAT_PERCENTAGES } from '../config/statics.config';
import { SubscriptionPlanQuery } from '../utils/types/request_query_dtos';
import { paginationHandler } from '../utils/pagination';

export const addSubscriptionPlan = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let subscriptionPlanBody: SubscriptionPlanBody
    subscriptionPlanBody = subscriptionPlanBodyCast(req.body)

    const vatReturn = calculateVat(subscriptionPlanBody.totalPrice, VAT_PERCENTAGES)
    console.log('vatReturn', vatReturn)
    subscriptionPlanBody.vat = vatReturn.vat
    subscriptionPlanBody.price = vatReturn.price
    subscriptionPlanBody.createdBy = user._id
    subscriptionPlanBody.createdAt = new Date(Date.now())


    let subscriptionPlan: SubscriptionPlan = await SubscriptionPlanModel.create(subscriptionPlanBody)

    if (subscriptionPlan) {
        return responseHandler({res: res, status: true, statusCode: 201, data: subscriptionPlan })
    }

    return next(new ErrorResponse('Could not add Subscription Plan.', 500))
})

export const editSubscriptionPlan = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let subscriptionPlanBody: SubscriptionPlanBody
    subscriptionPlanBody = subscriptionPlanBodyCast(req.body)

    const vatReturn = calculateVat(subscriptionPlanBody.totalPrice, VAT_PERCENTAGES)
    subscriptionPlanBody.vat = vatReturn.vat
    subscriptionPlanBody.price = vatReturn.price
    subscriptionPlanBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    subscriptionPlanBody.lastUpdatedAt = new Date(Date.now())

    let subscriptionPlan: SubscriptionPlan = await SubscriptionPlanModel.findById(subscriptionPlanBody._id)
    delete subscriptionPlan._id

    if (subscriptionPlan) {
        subscriptionPlan = await SubscriptionPlanModel.findByIdAndUpdate(subscriptionPlanBody._id, subscriptionPlanBody, {
            new: true,
            runValidators: true
        })

        if (subscriptionPlan) {
            return responseHandler({res: res, status: true, statusCode: 201, data: subscriptionPlan })
        }

         return next(new ErrorResponse('Could not update Subscription Plan.', 500))

    }
    return next(new ErrorResponse('Could not find Subscription Plan.', 404))
})

export const toggleActiveStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let subscriptionPlanBody: SubscriptionPlanBody
    subscriptionPlanBody = subscriptionPlanBodyCast(req.body)

    subscriptionPlanBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    subscriptionPlanBody.lastUpdatedAt = new Date(Date.now())

    let subscriptionPlan: SubscriptionPlan = await SubscriptionPlanModel.findById(subscriptionPlanBody._id)
    delete subscriptionPlanBody._id

    if(subscriptionPlan) {
        subscriptionPlan = await SubscriptionPlanModel.findByIdAndUpdate(subscriptionPlan._id, { isActive: !subscriptionPlan.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        })
        if(subscriptionPlan) {
            return responseHandler({res: res, status: true, statusCode: 200, data: subscriptionPlan })
        }

        return next(new ErrorResponse('Could not update subscription plan, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find subscription plan, please try again.', 404))
})


export const getSubscriptionPlan = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    let {
        _id,
        name,
        price,
        totalPrice,
        isUserSelectable,
        isActive,
        isDeleted,
        createdBy,
        createdAt,
        sort,
        page,
        limit
    } = req.query

    let subscriptionPlanQuery: SubscriptionPlanQuery = {} as SubscriptionPlanQuery
    subscriptionPlanQuery.isDeleted = false
    
    if (_id) {
        subscriptionPlanQuery._id = new mongoose.Types.ObjectId(_id.toString())
    }

    if (name) {
        subscriptionPlanQuery.name = name.toString()
    }

    if (price) {
        subscriptionPlanQuery.price = parseFloat(price.toString())
    }

    if (totalPrice) {
        subscriptionPlanQuery.totalPrice = parseFloat(totalPrice.toString())
    }

    if (isActive != null) {
        subscriptionPlanQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isUserSelectable != null) {
        subscriptionPlanQuery.isUserSelectable = (isUserSelectable == 'true' ? true : false);
    }

    if (isDeleted != null) {
        subscriptionPlanQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        subscriptionPlanQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        subscriptionPlanQuery.createdAt = new Date(createdAt.toString())
    }

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: SubscriptionPlanModel })

    let subscriptionPlans: Array<SubscriptionPlan> = await SubscriptionPlanModel.find(subscriptionPlanQuery)

    if (subscriptionPlans) {
        return responseHandler({res: res, status: true, statusCode: 201, data: subscriptionPlans, metaData: paginationData })
    }

    return next(new ErrorResponse('No registered Subscription Plan found.', 404))

})