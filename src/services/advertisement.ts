import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import { AdvertisementBody } from '../utils/types/method_return_dtos';
import { advertisementBodyCast } from '../utils/types/request_body_dtos';
import { AdvertisementModel } from '../models/Advertisement_Model';
import Advertisement from "../interfaces/Advertisement";
import Account from "../interfaces/Account";
import { paginationHandler } from '../utils/pagination';
import { AdvertisementQuery } from "../utils/types/request_query_dtos";

export const addAdvertisement = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let advertisementBody: AdvertisementBody
    advertisementBody = advertisementBodyCast(req.body)
    
    let oldName :String = req.file.originalname.replace(/\s/g,'_')

    advertisementBody.bannerImage = `${req.fileTimeStamp}_${oldName}`
    advertisementBody.createdAt = new Date(Date.now())
    advertisementBody.createdBy = new mongoose.Types.ObjectId(user._id)

    let advertisement: Advertisement = await AdvertisementModel.create(advertisementBody)

    if(advertisement) {
        return responseHandler({res: res, status: true, statusCode: 201, data: advertisement })
    }

    return next(new ErrorResponse('Could not add advertisement, please try again.', 500))
})

export const editAdvertisement = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let advertisementBody: AdvertisementBody
    advertisementBody = advertisementBodyCast(req.body)

    advertisementBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    advertisementBody.lastUpdatedAt = new Date(Date.now())

    let advertisement: Advertisement = await AdvertisementModel.findById(advertisementBody._id)
    delete advertisementBody._id

    if(advertisement) {
        advertisement = await AdvertisementModel.findByIdAndUpdate(advertisement._id, advertisementBody, {
            new: true,
            runValidators: true
        }).select({ accountName: 1 })
        if(advertisement) {
            return responseHandler({res: res, status: true, statusCode: 200, data: advertisement })
        }

        return next(new ErrorResponse('Could not update advertisement, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find advertisement, please try again.', 404))
})

export const toggleActiveStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let advertisementBody: AdvertisementBody
    advertisementBody = advertisementBodyCast(req.body)

    advertisementBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    advertisementBody.lastUpdatedAt = new Date(Date.now())

    let advertisement: Advertisement = await AdvertisementModel.findById(advertisementBody._id)
    delete advertisementBody._id

    if(advertisement) {
        advertisement = await AdvertisementModel.findByIdAndUpdate(advertisement._id, { isActive: !advertisement.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        })
        if(advertisement) {
            return responseHandler({res: res, status: true, statusCode: 200, data: advertisement })
        }

        return next(new ErrorResponse('Could not update advertisement, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find advertisement, please try again.', 404))
})

export const toggleDelete = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let advertisementBody: AdvertisementBody
    advertisementBody = advertisementBodyCast(req.body)

    advertisementBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    advertisementBody.lastUpdatedAt = new Date(Date.now())

    let advertisement: Advertisement = await AdvertisementModel.findById(advertisementBody._id)
    delete advertisementBody._id

    if(advertisement) {
        advertisement = await AdvertisementModel.findByIdAndUpdate(advertisement._id, { isDeleted: !advertisement.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        })
        if(advertisement) {
            return responseHandler({res: res, status: true, statusCode: 200, data: advertisement })
        }

        return next(new ErrorResponse('Could not toggle delete advertisement, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find advertisement, please try again.', 404))
})

export const getAdvertisement = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    let {
        _id,
        bannerTitle,
        bannerDescription,
        hyperlink,
        type,
        company,
        isActive,
        isDeleted,
        createdBy,
        createdAt,
        selectField,
        sort,
        page,
        limit
    } = req.query

    let advertisementQuery: AdvertisementQuery = {} as AdvertisementQuery
    advertisementQuery.isActive = true
    advertisementQuery.isDeleted = false

    if (_id) {
        advertisementQuery._id = new mongoose.Types.ObjectId(_id.toString())
    }

    if (bannerTitle) {
        advertisementQuery.bannerTitle = { "$regex": bannerTitle, "$options": "i" }
    }

    if (bannerDescription) {
        advertisementQuery.bannerDescription = { "$regex": bannerDescription, "$options": "i" }
    }

    if (company) {
        advertisementQuery.company = new mongoose.Types.ObjectId(company.toString())
    }

    if (type) {
        advertisementQuery.type = type.toString()
    }

    if (isActive != null) {
        advertisementQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        advertisementQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        advertisementQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        advertisementQuery.createdAt = new Date(createdAt.toString())
    }

    if (selectField != null) {
        selectField = selectField.toString();
    }

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: AdvertisementModel })

    let advertisements: Array<Advertisement> = await AdvertisementModel.find(advertisementQuery).sort({ 'isFeatured': -1 }).select(selectField)
        .populate({ 
            path: 'company',
            populate: [
                {
                    path: 'region',
                },
                {
                    path: 'country',
                }
            ] 
        })

    if (advertisements) {
        return responseHandler({res: res, status: true, statusCode: 200, data: advertisements, metaData: paginationData })
    }

    return next(new ErrorResponse('No registered advertisements found.', 404))

})