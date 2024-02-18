import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import Account from "../interfaces/Account";
import { AdImpressionBody } from "../utils/types/method_return_dtos";
import AdImpression from '../interfaces/Ad_Impression';
import { AdImpressionModel } from "../models/Ad_Impressions";
import { adImpressionBodyCast, advertisementBodyCast } from '../utils/types/request_body_dtos';
import { AdImpressionQuery } from "../utils/types/request_query_dtos";
import { paginationHandler } from "../utils/pagination";

export const logAdImpression = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let adImpressionBody: AdImpressionBody
    adImpressionBody = adImpressionBodyCast(req.body)
    
    adImpressionBody.createdAt = new Date(Date.now())
    adImpressionBody.createdBy = new mongoose.Types.ObjectId(user._id)

    let adImpression: AdImpression = await AdImpressionModel.create(adImpressionBody)

    if(adImpression) {
        return responseHandler({res: res, status: true, statusCode: 201, data: adImpression })
    }

    return next(new ErrorResponse('Could not log ad impression, please try again.', 500))
})

export const getAdImpressions = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    let {
        _id,
        type,
        advertisement,
        isActive,
        isDeleted,
        createdBy,
        createdAt,
        sort,
        page,
        limit
    } = req.query

    let adImpressionQuery: AdImpressionQuery = {} as AdImpressionQuery
    adImpressionQuery.isActive = true
    adImpressionQuery.isDeleted = false

    if (_id) {
        adImpressionQuery._id = new mongoose.Types.ObjectId(_id.toString())
    }

    if (advertisement) {
        adImpressionQuery.advertisement = new mongoose.Types.ObjectId(advertisement.toString())
    }

    if (type) {
        adImpressionQuery.type = type.toString()
    }

    if (isActive != null) {
        adImpressionQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        adImpressionQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        adImpressionQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        adImpressionQuery.createdAt = new Date(createdAt.toString())
    }

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: AdImpressionModel })

    let adImpressions: Array<AdImpression> = await AdImpressionModel.find(adImpressionQuery).sort({ 'isFeatured': -1 })
        .populate('advertisement')

    if (adImpressions) {
        return responseHandler({res: res, status: true, statusCode: 200, data: adImpressions, metaData: paginationData })
    }

    return next(new ErrorResponse('No registered ad impressions found.', 404))

})