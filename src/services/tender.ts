import axios from "axios";
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import { consturctTenderModel } from '../utils/tender_constructor';
import { TenderModel } from '../models/Tender_Model';
import { getStartEndDate } from '../utils/functions';
import { TenderQuery } from '../utils/types/request_query_dtos';
import { paginationHandler } from '../utils/pagination'
import CTender from '../classes/Tender';
import mongoose from 'mongoose';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import Region from '../interfaces/Region';
import Account from '../interfaces/Account';
import { AccountModel } from '../models/Account_Model';
import Tender from '../interfaces/Tender';
import { tenderBodyCast } from '../utils/types/request_body_dtos';
import { RolePermission, TenderBody, TenderSourceBody } from '../utils/types/method_return_dtos';
import { TENDER_QUERY_TYPES, TENDER_STATUSES } from "../utils/types/enums";
import { ALL_TENDERS, MY_TENDERS, SessionActivity } from '../utils/types/type_constants';
import TenderSource from "../interfaces/Tender_Source";
import { ADMIN_ROLES } from "../config/statics.config";
import { limitBelowEncoderAndEditorRoles } from "../utils/account_permission_walls";

export const scrappeTenders = async(req: Request, res: Response, next: NextFunction) => {
    let dates = getStartEndDate()

    console.log(dates)

    let allTenders : Array<CTender> = []

    let index = 0
    let totalPages = 1000

    // page count starts from 0 and ends at totalPages-1 (basically like array index)
    while (index < totalPages) {
        let result = await axios.get(`${process.env.SCRAPPE_URL}/?startDateTime=${dates.startDate}&endDateTime=${dates.endDate}&limit=${process.env.LIMIT}&page=${index}`, {
            headers: {
                'Authorization': `Bearer ${process.env.AUTHORIZATION}`,
                'Content-Type': 'application/json'
            },
        })

        if (result.data == null) {
            return responseHandler({res: res, status: false, statusCode: 404, msg: 'No tenders found for today!' })
        }

        console.log(index)
        console.log('count ', result.data.content.length)
        // console.log('first of list ', result.data.content[0].id)

        totalPages = result.data.totalPages

        result.data.content.forEach((tender: any) => {
            allTenders.push(consturctTenderModel(tender))
        })

        index++

    }

    let tenders = await TenderModel.insertMany(allTenders)

    if (tenders != null) {
        return responseHandler({res: res, status: true, statusCode: 200, msg: `Added ${tenders.length} tenders to database` })
    }
}

export const bookmarkTender = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let tenderBody: TenderBody
    tenderBody = tenderBodyCast(req.body)

    let tender: Tender = await TenderModel.findById(tenderBody._id)

    if(tender) {
        let account: Account = await AccountModel.findOne({_id: user._id, bookmarks: { $in: [ new mongoose.Types.ObjectId(tenderBody._id)] } })
        if(account) {
            account = await AccountModel.findByIdAndUpdate(user._id, { $pull: { bookmarks: tenderBody._id }}, {
                new: true,
                runValidators: true
            })
            // .populate<{ region: TenderSource }>('tenderSources')
            // .populate('language')
            // .populate('region')
            // .populate('categories')
        } else {
            account = await AccountModel.findByIdAndUpdate(user._id, { $push: { bookmarks: tenderBody._id }}, {
                new: true,
                runValidators: true 
            })
            // .populate<{ region: TenderSource }>('tenderSources')
            // .populate('language')
            // .populate('region')
            // .populate('categories')
        }

        if(account.bookmarks.includes(tender._id)) tender.isSaved = true
        else tender.isSaved = false

        if (account) {
            console.log('DONE SUBCC')
            return responseHandler({res: res, status: true, statusCode: 200, data: tender })
        }

        return next(new ErrorResponse('Could not bookmark tender. Please try again.', 500))
    }

    return next(new ErrorResponse('Could not find tender. Please try again.', 404))

})

export const toggleActiveStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user
    
    let rolePermission: RolePermission = limitBelowEncoderAndEditorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let tenderBody: TenderBody
    tenderBody = tenderBodyCast(req.body)

    let tender: Tender = await TenderModel.findById(tenderBody._id)

    tender = await TenderModel.findByIdAndUpdate(tenderBody._id, { isActive: !tender.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
        new: true,
        runValidators: true
    }).populate({
        path: 'createdBy',
        select: { 'fname': 1 }
    })

    if (tender) {
        return responseHandler({res: res, status: true, statusCode: 200, data: tender })
    }

    return next(new ErrorResponse('Could change Tender active status.', 500))

})

export const toggleIsPublished = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowEncoderAndEditorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let tenderBody: TenderBody
    tenderBody = tenderBodyCast(req.body)

    let tender: Tender = await TenderModel.findById(tenderBody._id)

    tender = await TenderModel.findByIdAndUpdate(tenderBody._id, { isPublished: !tender.isPublished, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
        new: true,
        runValidators: true
    }).populate({
        path: 'createdBy',
        select: { 'fname': 1 }
    })

    if (tender) {
        return responseHandler({res: res, status: true, statusCode: 200, data: tender })
    }

    return next(new ErrorResponse('Could change Tender isPublished status.', 500))

})

export const toggleIsFeatured = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowEncoderAndEditorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let tenderBody: TenderBody
    tenderBody = tenderBodyCast(req.body)

    let tender: Tender = await TenderModel.findById(tenderBody._id)

    tender = await TenderModel.findByIdAndUpdate(tenderBody._id, { isFeatured: !tender.isFeatured, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
        new: true,
        runValidators: true
    }).populate({
        path: 'createdBy',
        select: { 'fname': 1 }
    })

    if (tender) {
        return responseHandler({res: res, status: true, statusCode: 200, data: tender })
    }

    return next(new ErrorResponse('Could change Tender isFeatured status.', 500))

})

export const toggleDelete = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowEncoderAndEditorRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let tenderBody: TenderBody
    tenderBody = tenderBodyCast(req.body)

    let tender: Tender = await TenderModel.findById(tenderBody._id)

    tender = await TenderModel.findByIdAndUpdate(tenderBody._id, { isDeleted: !tender.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
        new: true,
        runValidators: true
    }).populate({
        path: 'createdBy',
        select: { 'fname': 1 }
    })

    if (tender) {
        return responseHandler({res: res, status: true, statusCode: 200, data: tender })
    }

    return next(new ErrorResponse('Could not delete Tender.', 500))

})

export const viewTender = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user
    
    let tenderBody: TenderBody
    tenderBody = tenderBodyCast(req.body)

    let tender: Tender = await TenderModel.findById(tenderBody._id)

    if (tender == null) {
        return next(new ErrorResponse('Could not find Tender.', 404))
    }

    tender = await TenderModel.findByIdAndUpdate(tenderBody._id, { $inc: { views: 1 } }, {
        new: true,
        runValidators: true
    }).populate<{ region: TenderSource }>('tenderSources')
    .populate('language')
    .populate('region')
    .populate('categories')


    const sessionActivity: SessionActivity = {
        type: 'tender-view',
        tender: new mongoose.Types.ObjectId(tender._id),
        timestamp: new Date(Date.now()),
        deviceInfo: tenderBody.deviceInfo
    }

    console.log('sessionActivity', sessionActivity)

    await AccountModel.findByIdAndUpdate(user._id, { $push: { sessionActivity: sessionActivity } })

    if (tender) {
        return responseHandler({res: res, status: true, statusCode: 200, data: tender })
    }

    return next(new ErrorResponse('Could not increase Tender view.', 500))

})

export const getTender = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let {
        _id,
        site_id,
        type,
        title,
        region,
        language,
        tenderSource,
        categories,
        bidOpeningDate,
        bidClosingDate,
        isPublished,
        isFeatured,
        isActive,
        isDeleted,
        createdBy,
        createdAt,
        startDate,
        endDate,
        status,
        selectFields,
        sort,
        page,
        limit
    } = req.query  

    let tenderQuery: TenderQuery = {} as TenderQuery
    tenderQuery.isDeleted = false
    tenderQuery.isPublished = true

    console.log('req.query T', req.query)


    if (_id) {
        tenderQuery._id = new mongoose.Types.ObjectId(_id.toString())
    }

    if (site_id) {
        tenderQuery.site_id = site_id.toString()
    }

    if (type) {
        tenderQuery.type = type.toString() as TENDER_QUERY_TYPES
    }

    if (title) {
        tenderQuery.title = { "$regex": title, "$options": "i" }
    }

    if (region) {
        tenderQuery.region = { "$in": region.toString().split(',').map((e) => new mongoose.Types.ObjectId(e.toString())) };
    }

    if (language) {
        tenderQuery.language = { "$in": language.toString().split(',').map((e) => new mongoose.Types.ObjectId(e.toString())) }
    }

    if (tenderSource) {
        tenderQuery.tenderSources = { "$in": tenderSource.toString().split(',').map((e) => new mongoose.Types.ObjectId(e.toString())) }
    }

    if (categories) {
        tenderQuery.categories = { "$in": categories.toString().split(',').map((e) => new mongoose.Types.ObjectId(e.toString())) }
    }

    if (bidOpeningDate) {
        tenderQuery.bidOpeningDate = new Date(bidOpeningDate.toString())
    }

    if (bidClosingDate) {
        tenderQuery.bidClosingDate = new Date(bidClosingDate.toString())
    }

    if (isPublished) {
        tenderQuery.isPublished = (isPublished == 'true' ? true : false);
    }

    if (isFeatured) {
        tenderQuery.isFeatured = (isFeatured == 'true' ? true : false);
    }

    if (status) {
        if(status == 'open') {
            tenderQuery.bidClosingDate = { $gt: new Date(Date.now()).toISOString() }
        } else if(status == 'closed') {
            tenderQuery.bidClosingDate = { $lt: new Date(Date.now()).toISOString() }
        }
    }

    if (isActive != null) {
        tenderQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        tenderQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        tenderQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        tenderQuery.createdAt = { $date: new Date(parseInt(createdAt.toString()))}
    }

    if (startDate && endDate) {
        tenderQuery.createdAt = { $gte: new Date(parseInt(startDate.toString())).toISOString(), $lt: new Date(parseInt(endDate.toString())).toISOString() }
    }

    if (selectFields != null) {
        selectFields = JSON.parse(selectFields.toString());
    }

    if (categories && region) {
        delete tenderQuery.region
        delete tenderQuery.categories
        tenderQuery.$and = [ 
            { region: { "$in": region.toString().split(',').map((e) => new mongoose.Types.ObjectId(e.toString())) } } ,
            { categories: { "$in": categories.toString().split(',').map((e) => new mongoose.Types.ObjectId(e.toString())) }}  
        ]
    }

    // if(tenderQuery.type == MY_TENDERS) {
    //     tenderQuery.language = { "$in": user.alertLanguages.map((e) => new mongoose.Types.ObjectId(e.toString())) }
    //     tenderQuery.region = { "$in": user.alertRegions.map((e) => new mongoose.Types.ObjectId(e.toString())) }
    //     tenderQuery.categories = { "$in": user.alertCategories.map((e) => new mongoose.Types.ObjectId(e.toString())) }
    // }

    delete tenderQuery.type

    console.log('tenderQuery', tenderQuery)

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), query: tenderQuery, Schema: TenderModel })

    let tenders = await TenderModel.find(tenderQuery).select(selectFields).sort(sort)
        .populate<{ region: TenderSource }>('tenderSources')
        .populate('language')
        .populate('region')
        .populate('categories')
        .populate({
            path: 'createdBy',
            select: { 'fname': 1 }
        })
        .populate({
            path: 'lastUpdatedBy',
            select: { 'fname': 1 }
        })
        .skip(paginationData.startIndex).limit(paginationData.limit).lean();

    tenders.forEach((e: Tender) => {
        if(user.bookmarks.includes(e._id)) e.isSaved = true
        else e.isSaved = false
    })
    
    if(tenders)  {
        return responseHandler({res: res, status: true, statusCode: 200, data: tenders, metaData: paginationData })
    }

    return next(new ErrorResponse('No Tender found.', 404))
})

export const getBookmarkedTender = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    const account: Account = await AccountModel.findById(user._id).populate({ 
        path: 'bookmarks',
        populate: [{
                path: 'language'
            },
            {
                path: 'tenderSources'
            },
            {
                path: 'region'
            },
            {
                path: 'categories'
            },
            {
                path: 'createdBy'
            }
        ] 
     })

    if(account) {
        return responseHandler({res: res, status: true, statusCode: 200, data: account.bookmarks })
    }
    
    return next(new ErrorResponse('No Bookmarked Tender found.', 404))

})
