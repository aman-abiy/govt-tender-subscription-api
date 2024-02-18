import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import { CompanyBody } from '../utils/types/method_return_dtos';
import { companyBodyCast } from '../utils/types/request_body_dtos';
import { CompanyModel } from '../models/Company_Model';
import Company from "../interfaces/Company";
import Account from "../interfaces/Account";
import { paginationHandler } from '../utils/pagination';
import { CompanyQuery } from "../utils/types/request_query_dtos";

export const addCompany = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let companyBody: CompanyBody
    companyBody = companyBodyCast(req.body)
    companyBody.createdAt = new Date(Date.now())
    companyBody.createdBy = new mongoose.Types.ObjectId(user._id)

    let company: Company = await CompanyModel.create(companyBody)

    if(company) {
        return responseHandler({res: res, status: true, statusCode: 201, data: company })
    }

    return next(new ErrorResponse('Could not add company account, please try again.', 500))
})

export const editCompany = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let companyBody: CompanyBody
    companyBody = companyBodyCast(req.body)

    companyBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    companyBody.lastUpdatedAt = new Date(Date.now())

    let company: Company = await CompanyModel.findById(companyBody._id)
    delete companyBody._id

    if(company) {
        company = await CompanyModel.findByIdAndUpdate(company._id, companyBody, {
            new: true,
            runValidators: true
        }).select({ accountName: 1 })
        if(company) {
            return responseHandler({res: res, status: true, statusCode: 200, data: company })
        }

        return next(new ErrorResponse('Could not update company account, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find company account, please try again.', 404))
})

export const toggleActiveStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let companyBody: CompanyBody
    companyBody = companyBodyCast(req.body)

    companyBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    companyBody.lastUpdatedAt = new Date(Date.now())

    let company: Company = await CompanyModel.findById(companyBody._id)
    delete companyBody._id

    if(company) {
        company = await CompanyModel.findByIdAndUpdate(company._id, { isActive: !company.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        })
        if(company) {
            return responseHandler({res: res, status: true, statusCode: 200, data: company })
        }

        return next(new ErrorResponse('Could not update company account, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find company account, please try again.', 404))
})

export const toggleDelete = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let companyBody: CompanyBody
    companyBody = companyBodyCast(req.body)

    companyBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    companyBody.lastUpdatedAt = new Date(Date.now())

    let company: Company = await CompanyModel.findById(companyBody._id)
    delete companyBody._id

    if(company) {
        company = await CompanyModel.findByIdAndUpdate(company._id, { isDeleted: !company.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        })
        if(company) {
            return responseHandler({res: res, status: true, statusCode: 200, data: company })
        }

        return next(new ErrorResponse('Could not toggle delete company account, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find company account, please try again.', 404))
})

export const getCompany = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    let {
        _id,
        name,
        address,
        region,
        country,
        phone1,
        tin,
        email,
        isActive,
        isDeleted,
        sort,
        page,
        limit,
        createdAt,
        createdBy,
        selectField
    } = req.query

    let companyQuery: CompanyQuery = {} as CompanyQuery
    companyQuery.isDeleted = false

    if (_id) {
        companyQuery._id = new mongoose.Types.ObjectId(_id.toString())
    }

    if (name) {
        companyQuery.name = { "$regex": name, "$options": "i" }
    }

    if (address) {
        companyQuery.address = { "$regex": address, "$options": "i" }
    }

    if (region) {
        companyQuery.region = new mongoose.Types.ObjectId(region.toString())
    }

    if (country) {
        companyQuery.country = new mongoose.Types.ObjectId(country.toString())
    }

    if (tin) {
        companyQuery.tin = { "$regex": tin, "$options": "i" }
    }

    if (email) {
        companyQuery.email = { "$regex": email, "$options": "i" }
    }

    if (isActive != null) {
        companyQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        companyQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        companyQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        companyQuery.createdAt = new Date(createdAt.toString())
    }

    if (selectField != null) {
        selectField = selectField.toString();
    }

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: CompanyModel })

    let companys: Array<Company> = await CompanyModel.find({ ...companyQuery, ...(phone1 != null ? { 'mobile.e164': { "$regex": (phone1.toString()).replace('+', ''), "$options": "i" }} : {}) }).select(selectField)

    if (companys) {
        return responseHandler({res: res, status: true, statusCode: 200, data: companys, metaData: paginationData })
    }

    return next(new ErrorResponse('No registered company accounts found.', 404))

})