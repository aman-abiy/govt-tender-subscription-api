import mongoose from 'mongoose';
import slug from 'slug';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/async_handler'
import { CountryBody, RolePermission } from '../utils/types/method_return_dtos';
import { countryBodyCast } from '../utils/types/request_body_dtos';
import { CountryModel } from '../models/Country_Model';
import Country from '../interfaces/Country';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import Account from '../interfaces/Account';
import { CountryQuery } from '../utils/types/request_query_dtos';
import { paginationHandler } from '../utils/pagination';
import { limitBelowAdminRoles } from '../utils/account_permission_walls';

export const addCountry = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let countryBody: CountryBody
    countryBody = countryBodyCast(req.body)

    countryBody.slug = slug(countryBody.name.en)
    countryBody.createdAt = new Date(Date.now())
    countryBody.createdBy = user._id

    let country: Country = await CountryModel.create(countryBody)

    if (country) {
        return responseHandler({res: res, status: true, statusCode: 201, data: country })
    }

    return next(new ErrorResponse('Could not add country.', 500))

})

export const editCountry = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let countryBody: CountryBody
    countryBody = countryBodyCast(req.body)

    countryBody.slug = slug(countryBody.name.en)

    let country: Country = await CountryModel.findByIdAndUpdate(countryBody._id, countryBody, {
        new: true,
        runValidators: true
    })

    if (country) {
        return responseHandler({res: res, status: true, statusCode: 201, data: country })
    }

    return next(new ErrorResponse('Could not add country.', 500))

})

export const toggleActiveStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let countryBody: CountryBody
    countryBody = countryBodyCast(req.body)

    let country: Country = await CountryModel.findById(countryBody._id)

    country = await CountryModel.findByIdAndUpdate(countryBody._id, { isActive: !country.isActive }, {
        new: true,
        runValidators: true
    })

    if (country) {
        return responseHandler({res: res, status: true, statusCode: 201, data: country })
    }

    return next(new ErrorResponse('Could not add country.', 500))

})

export const toggleDelete = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }
    
    let countryBody: CountryBody
    countryBody = countryBodyCast(req.body)

    let country: Country = await CountryModel.findById(countryBody._id)

    country = await CountryModel.findByIdAndUpdate(countryBody._id, { isDeleted: !country.isDeleted }, {
        new: true,
        runValidators: true
    })

    if (country) {
        return responseHandler({res: res, status: true, statusCode: 201, data: country })
    }

    return next(new ErrorResponse('Could not add country.', 500))

})

export const getCountry = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    let {
        id,
        slug,
        isActive,
        isDeleted,
        createdBy,
        createdAt,
        sort,
        page,
        limit
    } = req.query

    let countryQuery: CountryQuery = {} as CountryQuery
    countryQuery.isDeleted = false

    if (id) {
        countryQuery._id = new mongoose.Types.ObjectId(id.toString())
    }

    if (slug) {
        countryQuery.slug = { "$regex": slug, "$options": "i" }
    }

    if (isActive != null) {
        countryQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        countryQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        countryQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        countryQuery.createdAt = new Date(createdAt.toString())
    }

    console.log('countryQuery ', countryQuery)

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: CountryModel })


    let country: Array<Country> = await CountryModel.find(countryQuery)

    if (country) {
        return responseHandler({res: res, status: true, statusCode: 201, data: country, metaData: paginationData })
    }

    return next(new ErrorResponse('No registered country found.', 404))

})