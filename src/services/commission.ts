import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import Subscription from "../interfaces/Subscription";
import { SubscriptionModel } from '../models/Subscription_Model';
import { CommissionsQuery } from "../utils/types/request_query_dtos";
import { PaymentModel } from '../models/Payment_Model';
import Payment from '../interfaces/Payment';
import { DEFAULT_BONUS_TRESHOLD, DEFAULT_COMMISSIONS_PERCENTAGE } from '../config/statics.config';

export const getCommissionsList = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let {
        startDate,
        endDate,
        createdBy
    } = req.query

    console.log('req.query C', req.query)

    let commissionsQuery: CommissionsQuery = {} as CommissionsQuery;
    commissionsQuery.isPaid = true;

    if (startDate && endDate) {
        commissionsQuery.createdAt = { $gte: new Date(parseInt(startDate.toString())), $lt: new Date(parseInt(endDate.toString())) }
    }

    if(createdBy) {
        commissionsQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    console.log('commissionsQuery C', commissionsQuery)

    let payments: Array<Payment> = await PaymentModel.aggregate(
        [   
            {
                $match : commissionsQuery
            },
            { 
                $lookup: {
                    from: 'accounts', 
                    localField: 'createdBy', 
                    foreignField: '_id', 
                    as: 'createdBy',
                    pipeline: [
                        {
                            $project: {
                                fname: 1,
                                lname: 1,
                            },
                        }
                    ]
                } 
            },
            {
                $unwind: "$createdBy"
            },
            {
                $group: {
                    _id: "$createdBy",
                    count: { $sum: 1 },
                    total: {
                        $sum: "$price"
                    }
                }
            },
            { 
                $project : { 
                    total : { 
                        $multiply : [ 
                            ((commissionsQuery.commissionPercentage ?? DEFAULT_COMMISSIONS_PERCENTAGE) / 100), '$total' 
                        ] 
                    },
                    bonus: {
                        $multiply : [
                            { 
                                $floor: { 
                                    $divide: [ '$total', commissionsQuery.bonusThreshold ?? DEFAULT_BONUS_TRESHOLD]
                                } 
                            }, 1000
                        ]
                    },
                    count: '$count'
                } 
            },
        ],
    )

    console.log('payments', payments)
    
    if(payments) {
        return responseHandler({res: res, status: true, statusCode: 200, data: payments })
    }

    return next(new ErrorResponse('No commisions data found.', 500))
})