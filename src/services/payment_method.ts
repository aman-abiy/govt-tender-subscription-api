import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import PaymentMethod from "../interfaces/Payment_Method";
import { paymentMethodBodyCast } from "../utils/types/request_body_dtos";
import { PaymentMethodBody } from "../utils/types/method_return_dtos";
import { PaymentMethodModel } from '../models/Payment_Method_Model';
import Account from "../interfaces/Account";
import { paginationHandler } from '../utils/pagination';
import { PaymentMethodQuery } from "../utils/types/request_query_dtos";

export const addPaymentMethod = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let paymentMethodBody: PaymentMethodBody
    paymentMethodBody = paymentMethodBodyCast(req.body)

    paymentMethodBody.createdAt = new Date(Date.now())
    paymentMethodBody.createdBy = new mongoose.Types.ObjectId(user._id)

    let paymentMethod: PaymentMethod = await PaymentMethodModel.create(paymentMethodBody)

    if(paymentMethod) {
        return responseHandler({res: res, status: true, statusCode: 201, data: paymentMethod })
    }

    return next(new ErrorResponse('Could not create payment method, please try again.', 500))
})

export const editPaymentMethod = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let paymentMethodBody: PaymentMethodBody
    paymentMethodBody = paymentMethodBodyCast(req.body)

    paymentMethodBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    paymentMethodBody.lastUpdatedAt = new Date(Date.now())

    let paymentMethod: PaymentMethod = await PaymentMethodModel.findById(paymentMethodBody._id)
    delete paymentMethodBody._id

    if(paymentMethod) {
        paymentMethod = await PaymentMethodModel.findByIdAndUpdate(paymentMethod._id, paymentMethodBody, {
            new: true,
            runValidators: true
        })
        if(paymentMethod) {
            return responseHandler({res: res, status: true, statusCode: 200, data: paymentMethod })
        }

        return next(new ErrorResponse('Could not update payment method, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find payment method, please try again.', 404))
})

export const toggleActiveStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let paymentMethodBody: PaymentMethodBody
    paymentMethodBody = paymentMethodBodyCast(req.body)

    paymentMethodBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    paymentMethodBody.lastUpdatedAt = new Date(Date.now())

    let paymentMethod: PaymentMethod = await PaymentMethodModel.findById(paymentMethodBody._id)
    delete paymentMethodBody._id

    if(paymentMethod) {
        paymentMethod = await PaymentMethodModel.findByIdAndUpdate(paymentMethod._id, { isActive: !paymentMethod.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        })
        if(paymentMethod) {
            return responseHandler({res: res, status: true, statusCode: 200, data: paymentMethod })
        }

        return next(new ErrorResponse('Could not update payment method, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find payment method, please try again.', 404))
})

export const toggleDelete = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let paymentMethodBody: PaymentMethodBody
    paymentMethodBody = paymentMethodBodyCast(req.body)

    paymentMethodBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    paymentMethodBody.lastUpdatedAt = new Date(Date.now())

    let paymentMethod: PaymentMethod = await PaymentMethodModel.findById(paymentMethodBody._id)
    delete paymentMethodBody._id

    if(paymentMethod) {
        paymentMethod = await PaymentMethodModel.findByIdAndUpdate(paymentMethod._id, { isDeleted: !paymentMethod.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id })
        if(paymentMethod) {
            return responseHandler({res: res, status: true, statusCode: 200, data: paymentMethod })
        }

        return next(new ErrorResponse('Could not toggle delete payment method account, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find payment method account, please try again.', 404))
})


export const getPaymentMethod = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    let {
        _id,
        name,
        isActive,
        isDeleted,
        createdBy,
        createdAt,
        sort,
        page,
        limit
    } = req.query

    let paymentMethodQuery: PaymentMethodQuery = {} as PaymentMethodQuery
    paymentMethodQuery.isDeleted = false

    if (_id) {
        paymentMethodQuery._id = new mongoose.Types.ObjectId(_id.toString())
    }

    if (name) {
        paymentMethodQuery.name = { "$regex": name, "$options": "i" }
    }

    if (isActive != null) {
        paymentMethodQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        paymentMethodQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        paymentMethodQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        paymentMethodQuery.createdAt = new Date(createdAt.toString())
    }

    console.log('paymentMethodQuery ', paymentMethodQuery)

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: PaymentMethodModel })

    let paymentMethod: Array<PaymentMethod> = await PaymentMethodModel.find(paymentMethodQuery)

    if (paymentMethod) {
        return responseHandler({res: res, status: true, statusCode: 200, data: paymentMethod, metaData: paginationData })
    }

    return next(new ErrorResponse('No registered payment method found.', 404))

})