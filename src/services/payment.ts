import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import { paginationHandler } from '../utils/pagination';
import { PaymentQuery } from "../utils/types/request_query_dtos";
import Payment from "../interfaces/Payment";
import { PaymentModel } from "../models/Payment_Model";
import { RolePermission } from "../utils/types/method_return_dtos";
import { limitBelowEncoderAndEditorRoles } from "../utils/account_permission_walls";
import Account from "../interfaces/Account";
import { PaymentTotal } from '../utils/types/type_constants';


export const getPayment = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user
    
    let rolePermission: RolePermission = limitBelowEncoderAndEditorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }
    
    let {
        _id,
        bank,
        paymentMethod,
        transactionRef,
        isPaid,
        isActive,
        isDeleted,
        createdBy,
        createdAt,
        sort,
        page,
        limit
    } = req.query

    console.log('req.query P', req.query)

    let paymentQuery: PaymentQuery = {} as PaymentQuery
    paymentQuery.isDeleted = false

    if (_id) {
        paymentQuery._id = new mongoose.Types.ObjectId(_id.toString())
    }

    if (bank) {
        paymentQuery.bank = new mongoose.Types.ObjectId(bank.toString())
    }

    if (paymentMethod) {
        paymentQuery.paymentMethod = new mongoose.Types.ObjectId(paymentMethod.toString())
    }

    if (transactionRef) {
        paymentQuery.transactionRef = transactionRef.toString()
    }

    if (isPaid != null) {
        paymentQuery.isPaid = (isPaid == 'true' ? true : false);
    }

    if (isActive != null) {
        paymentQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        paymentQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        paymentQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        paymentQuery.createdAt = new Date(createdAt.toString())
    }

    console.log('paymentQuery', paymentQuery)

    const paginationData = await paginationHandler({ query: paymentQuery, queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: PaymentModel })

    let payments: Array<Payment> = await PaymentModel.find(paymentQuery).sort(sort)
        .populate('bank')
        .populate('paymentMethod')
        .skip(paginationData.startIndex).limit(paginationData.limit).lean();
    
    const total: Array<PaymentTotal> = await PaymentModel.aggregate([
        {
            $group: {
                _id: null,
                totalPrice: {
                    $sum: "$price"
                }
            }
        },
    ])

    if (payments) {
        return responseHandler({res: res, status: true, statusCode: 200, data: { payments: payments, total: total[0].totalPrice }})
    }

    return next(new ErrorResponse('No registered payment method found.', 404))

})