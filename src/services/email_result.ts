import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import { paginationHandler } from '../utils/pagination';
import { EmailResultQuery } from "../utils/types/request_query_dtos";
import { EmailResultModel } from '../models/Email_Result_Model';
import EmailResult from "../interfaces/Email_Result";
import Account from "../interfaces/Account";
import { EmailResultBody } from "../utils/types/method_return_dtos";
import { emailResultBodyCast } from '../utils/types/request_body_dtos';

export const getEmailResult = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let {
        _id,
        account,
        type,
        isSent,
        isOpened,
        isDeleted,
        createdAt,
        select,
        sort,
        page,
        limit
    } = req.query

    let emailResultQuery: EmailResultQuery = {} as EmailResultQuery
    emailResultQuery.isDeleted = false

    if (_id) {
        emailResultQuery._id = new mongoose.Types.ObjectId(_id.toString())
    }

    if (account) {
        emailResultQuery.account = new mongoose.Types.ObjectId(account.toString())
    }

    if (type != null) {
        emailResultQuery.type = type.toString();
    }

    if (isSent != null) {
        emailResultQuery.isSent = (isSent == 'true' ? true : false);
    }

    if (isOpened != null) {
        emailResultQuery.isOpened = (isOpened == 'true' ? true : false);
    }

    if (isDeleted != null) {
        emailResultQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdAt) {
        emailResultQuery.createdAt = new Date(createdAt.toString())
    }

    if (select != null) {
        select = JSON.parse(select.toString())
    }

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), query: emailResultQuery, Schema: EmailResultModel })

    let emailResults: Array<EmailResult>

    if(_id != null) {
        emailResults = await EmailResultModel.find(emailResultQuery)
        .populate({
            path: 'tenders',
            populate: [{
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
            ...(select != null ? { select: select } : {})
        }).skip(paginationData.startIndex).limit(paginationData.limit).lean().sort(sort)
    } else {
        emailResults = await EmailResultModel.find(emailResultQuery)
        .skip(paginationData.startIndex).limit(paginationData.limit).lean().sort(sort)
    }

    if (emailResults) {
        return responseHandler({res: res, status: true, statusCode: 200, data: emailResults, metaData: paginationData })
    }

    return next(new ErrorResponse('No sent emails found.', 404))

})

export const openEmail = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let {
        readCheckKey
    } = req.query

    let emailResultQuery: EmailResultQuery = {} as EmailResultQuery

    if (readCheckKey) {
        emailResultQuery.readCheckKey = parseInt(readCheckKey.toString())
    }

    let emailResult: EmailResult = await EmailResultModel.findOne({ readCheckKey: emailResultQuery.readCheckKey })

    if(emailResult) {
       if (!emailResult.isOpened) {
            emailResult = await EmailResultModel.findByIdAndUpdate(emailResult._id, { isOpened: true, openedAt: new Date(Date.now()) }, {
                new: true,
                runValidators: true
            })
            if(emailResult) {
                return responseHandler({res: res, status: true, statusCode: 200, data: emailResult })
            }

            return next(new ErrorResponse('Could not set Alert Email as opened, please try again.', 500))
        }
        return next(new ErrorResponse('Email has already been read.', 409))
    }
    return next(new ErrorResponse('Could not find Alert Email, please try again.', 404))
})

