import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import { CurrencyModel } from '../models/Currency_Model';
import Currency from "../interfaces/Currency";
import Account from "../interfaces/Account";
import { currencyBodyCast } from '../utils/types/request_body_dtos';
import { CurrencyBody } from "../utils/types/method_return_dtos";
import { paginationHandler } from "../utils/pagination";
import { CurrencyQuery } from "../utils/types/request_query_dtos";

export const addCurrency = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let currencyBody: CurrencyBody
    currencyBody = currencyBodyCast(req.body)

    currencyBody.createdAt = new Date(Date.now())
    currencyBody.createdBy = new mongoose.Types.ObjectId(user._id)

    let currency: Currency = await CurrencyModel.create(currencyBody)

    if(currency) {
        return responseHandler({res: res, status: true, statusCode: 201, data: currency })
    }

    return next(new ErrorResponse('Could not add currency account, please try again.', 500))
})

export const editCurrency = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let currencyBody: CurrencyBody
    currencyBody = currencyBodyCast(req.body)

    currencyBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    currencyBody.lastUpdatedAt = new Date(Date.now())

    let currency: Currency = await CurrencyModel.findById(currencyBody._id)
    delete currencyBody._id

    if(currency) {
        currency = await CurrencyModel.findByIdAndUpdate(currency._id, currencyBody)
        if(currency) {
            return responseHandler({res: res, status: true, statusCode: 200, data: currency })
        }

        return next(new ErrorResponse('Could not update currency, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find currency, please try again.', 404))
})

export const toggleActiveStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let currencyBody: CurrencyBody
    currencyBody = currencyBodyCast(req.body)

    currencyBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    currencyBody.lastUpdatedAt = new Date(Date.now())

    let currency: Currency = await CurrencyModel.findById(currencyBody._id)
    delete currencyBody._id

    if(currency) {
        currency = await CurrencyModel.findByIdAndUpdate(currency._id, { isActive: !currency.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id })
        if(currency) {
            return responseHandler({res: res, status: true, statusCode: 200, data: currency })
        }

        return next(new ErrorResponse('Could not update currency, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find currency, please try again.', 404))
})

export const toggleDelete = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let currencyBody: CurrencyBody
    currencyBody = currencyBodyCast(req.body)

    currencyBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    currencyBody.lastUpdatedAt = new Date(Date.now())

    let currency: Currency = await CurrencyModel.findById(currencyBody._id)
    delete currencyBody._id

    if(currency) {
        currency = await CurrencyModel.findByIdAndUpdate(currency._id, { isDeleted: !currency.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id })
        if(currency) {
            return responseHandler({res: res, status: true, statusCode: 200, data: currency })
        }

        return next(new ErrorResponse('Could not toggle delete currency, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find currency, please try again.', 404))
})

export const getCurrency = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    let {
        id,
        name,
        iso3,
        isActive,
        isDeleted,
        createdBy,
        createdAt,
        sort,
        page,
        limit
    } = req.query

    let currencyQuery: CurrencyQuery = {} as CurrencyQuery
    currencyQuery.isDeleted = false

    if (id) {
        currencyQuery._id = new mongoose.Types.ObjectId(id.toString())
    }

    if (name) {
        currencyQuery.name = { "$regex": name, "$options": "i" }
    }

    if (iso3) {
        currencyQuery.iso3 = iso3.toString()
    }

    if (isActive != null) {
        currencyQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        currencyQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        currencyQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        currencyQuery.createdAt = new Date(createdAt.toString())
    }

    console.log('currencyQuery ', currencyQuery)

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: CurrencyModel })


    let currency: Array<Currency> = await CurrencyModel.find(currencyQuery)

    if (currency) {
        return responseHandler({res: res, status: true, statusCode: 200, data: currency, metaData: paginationData })
    }

    return next(new ErrorResponse('No registered currency found.', 404))

})