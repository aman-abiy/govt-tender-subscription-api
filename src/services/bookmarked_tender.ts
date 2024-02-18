import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import { BookmarkedTenderBody } from '../utils/types/method_return_dtos';
import { bookmarkedTenderBodyCast } from '../utils/types/request_body_dtos';
import { BookmarkedTenderModel } from '../models/Bookmarked_Tender_Model';
import Account from "../interfaces/Account";
import { paginationHandler } from '../utils/pagination';
import { BookmarkedTenderQuery } from "../utils/types/request_query_dtos";
import BookmarkedTender from '../interfaces/Bookmarked_Tender';

export const toggleBookmarkedTender = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let bookmarkedTenderBody: BookmarkedTenderBody
    bookmarkedTenderBody = bookmarkedTenderBodyCast(req.body)
    bookmarkedTenderBody.lastUpdatedAt = new Date(Date.now())
    bookmarkedTenderBody.createdAt = new Date(Date.now())

    let bookmarkedTenders: Array<BookmarkedTender> = await BookmarkedTenderModel.find({ account: bookmarkedTenderBody.account, tender: bookmarkedTenderBody.tender })
    
    let bookmarkedTender: BookmarkedTender = null;

    if(bookmarkedTenders[0] == null) {
        bookmarkedTender = await BookmarkedTenderModel.create(bookmarkedTenderBody)
        bookmarkedTender = await BookmarkedTenderModel.findById(bookmarkedTender._id)
        .populate({ 
            path: 'tender',
            populate: [
                {
                    path: 'language'
                },
                {
                    path: 'region'
                },
                {
                    path: 'tenderSources'
                },
                {
                    path: 'categories'
                }
            ],
        })

        if(bookmarkedTender) {
            return responseHandler({res: res, status: true, statusCode: 201, data: bookmarkedTender })
        }

        return next(new ErrorResponse('Could not save tender, please try again.', 500))
    } else {
        bookmarkedTender = await BookmarkedTenderModel.findByIdAndUpdate(bookmarkedTenders[0]._id, { isRemoved: !bookmarkedTenders[0].isRemoved, lastUpdatedAt: new Date(Date.now()) }, {
            new: true,
            runValidators: true
        }).populate({ 
            path: 'tender',
            populate: [
                {
                    path: 'language'
                },
                {
                    path: 'region'
                },
                {
                    path: 'tenderSources'
                },
                {
                    path: 'categories'
                }
            ],
        })

        if(bookmarkedTender) {
            return responseHandler({res: res, status: true, statusCode: 201, data: bookmarkedTender })
        }

        return next(new ErrorResponse('Could not save tender, please try again.', 500))
    }
    
})

export const checkBookmarked = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let {
        tender,
        account
    } = req.query

    let bookmarkedTenderQuery: BookmarkedTenderQuery = {} as BookmarkedTenderQuery
    bookmarkedTenderQuery.isRemoved = false
    bookmarkedTenderQuery.isDeleted = false

    if (tender) {
        bookmarkedTenderQuery.tender = new mongoose.Types.ObjectId(tender.toString())
    }

    if (account) {
        bookmarkedTenderQuery.account = new mongoose.Types.ObjectId(account.toString())
    }

    let bookmarkedTenders: Array<BookmarkedTender> = await BookmarkedTenderModel.find(bookmarkedTenderQuery)

    if(bookmarkedTenders[0] == null) {
        return responseHandler({res: res, status: true, statusCode: 201, data: false })
    } else {
        return responseHandler({res: res, status: true, statusCode: 201, data: true })
    }
})

export const getBookmarkedTender = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    let {
        _id,
        account,
        tender,
        isRemoved,
        isDeleted,
        lastUpdatedAt,
        createdAt,
        selectFields,
        sort,
        page,
        limit
    } = req.query

    let bookmarkedTenderQuery: BookmarkedTenderQuery = {} as BookmarkedTenderQuery
    bookmarkedTenderQuery.isRemoved = false
    bookmarkedTenderQuery.isDeleted = false

    let selectFieldObject = null
    let selectFieldObjectKeys: Array<string> = []
    let populationObjects: Array<Object> = []

    if (_id) {
        bookmarkedTenderQuery._id = new mongoose.Types.ObjectId(_id.toString())
    }

    if (account) {
        bookmarkedTenderQuery.account = new mongoose.Types.ObjectId(account.toString())
    }
    
    if (tender) {
        bookmarkedTenderQuery.tender = new mongoose.Types.ObjectId(tender.toString())
    }

    if (isRemoved != null) {
        bookmarkedTenderQuery.isRemoved = (isRemoved == 'true' ? true : false);
    }

    if (isDeleted != null) {
        bookmarkedTenderQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (lastUpdatedAt) {
        bookmarkedTenderQuery.lastUpdatedAt = new Date(lastUpdatedAt.toString())
    }

    if (createdAt) {
        bookmarkedTenderQuery.createdAt = new Date(createdAt.toString())
    }

    if (selectFields != null) {
        selectFieldObject = JSON.parse(selectFields.toString()) as Object;
        selectFieldObjectKeys = Object.keys(selectFieldObject)
    }

    console.log('selectFieldObject', selectFieldObject)
    console.log('selectFieldObjectKeys', selectFieldObjectKeys)

    if(selectFieldObjectKeys.length > 0) {
        if(!selectFieldObjectKeys.includes('language')) {
            null
        } else {
            populationObjects.push({ path: 'language' })
        }

        if(!selectFieldObjectKeys.includes('region')) {
            null
        } else {
            populationObjects.push({ path: 'region' })
        }

        if(!selectFieldObjectKeys.includes('tenderSources')) {
            null
        } else {
            populationObjects.push({ path: 'tenderSources' })
        }

        if(!selectFieldObjectKeys.includes('categories')) {
            null
        } else {
            populationObjects.push({ path: 'categories' })
        }
    } else {
        populationObjects.push({ path: 'language' })
        populationObjects.push({ path: 'region' })
        populationObjects.push({ path: 'tenderSources' })
        populationObjects.push({ path: 'categories' })
    }

    console.log('populationObjects', populationObjects)

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: BookmarkedTenderModel })

    let bookmarkedTenders: Array<BookmarkedTender> = await BookmarkedTenderModel.find(bookmarkedTenderQuery).sort(sort)
        // .populate('account')
        .populate({ 
            path: 'tender',
            populate: populationObjects,
            ...(selectFieldObject != null ? { select: { ...selectFieldObject }  } : {}),
        })
        .skip(paginationData.startIndex).limit(paginationData.limit)

    if (bookmarkedTenders) {
        return responseHandler({res: res, status: true, statusCode: 200, data: bookmarkedTenders, metaData: paginationData })
    }

    return next(new ErrorResponse('No saved tender found.', 404))

})