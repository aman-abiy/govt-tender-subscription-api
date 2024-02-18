import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/async_handler';
import Language from '../interfaces/Language';
import { LanguageModel } from '../models/Language_Model';
import { languageBodyCast } from '../utils/types/request_body_dtos';
import { LanguageBody, RolePermission } from '../utils/types/method_return_dtos';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import Account from '../interfaces/Account';
import { paginationHandler } from '../utils/pagination';
import { LanguageQuery } from '../utils/types/request_query_dtos';
import { limitBelowAdminRoles } from '../utils/account_permission_walls';

export const addLanguage = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }
    
    let languageBody: LanguageBody
    languageBody = languageBodyCast(req.body)
    languageBody.createdAt = new Date(Date.now())
    languageBody.createdBy = user._id

    let language: Language = await LanguageModel.create(languageBody)

    if (language) {
        return responseHandler({res: res, status: true, statusCode: 201, data: language })
    }

    return next(new ErrorResponse('Could not add language.', 500))

})

export const editLanguage = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let languageBody: LanguageBody
    languageBody = languageBodyCast(req.body)

    let language: Language = await LanguageModel.findByIdAndUpdate(languageBody._id, languageBody, {
        new: true,
        runValidators: true
    })

    if (language) {
        return responseHandler({res: res, status: true, statusCode: 201, data: language })
    }

    return next(new ErrorResponse('Could not add language.', 500))

})

export const toggleActiveStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let languageBody: LanguageBody
    languageBody = languageBodyCast(req.body)

    let language: Language = await LanguageModel.findById(languageBody._id)

    language = await LanguageModel.findByIdAndUpdate(languageBody._id, { isActive: !language.isActive }, {
        new: true,
        runValidators: true
    })

    if (language) {
        return responseHandler({res: res, status: true, statusCode: 201, data: language })
    }

    return next(new ErrorResponse('Could not add language.', 500))

})

export const toggleDelete = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }
    
    let languageBody: LanguageBody
    languageBody = languageBodyCast(req.body)

    let language: Language = await LanguageModel.findById(languageBody._id)

    language = await LanguageModel.findByIdAndUpdate(languageBody._id, { isDeleted: !language.isDeleted }, {
        new: true,
        runValidators: true
    })

    if (language) {
        return responseHandler({res: res, status: true, statusCode: 201, data: language })
    }

    return next(new ErrorResponse('Could not add language.', 500))

})

export const getLanguage = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    let {
        id,
        iso,
        iso3,
        name,
        isActive,
        isDeleted,
        createdBy,
        createdAt,
        sort,
        page,
        limit
    } = req.query

    let languageQuery: LanguageQuery = {} as LanguageQuery
    languageQuery.isDeleted = false

    if (id) {
        languageQuery._id = new mongoose.Types.ObjectId(id.toString())
    }

    if (iso) {
        languageQuery.iso = iso.toString()
    }

    if (iso3) {
        languageQuery.iso3 = iso3.toString()
    }

    if (name) {
        languageQuery.name = name.toString()
    }

    if (isActive != null) {
        languageQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        languageQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        languageQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        languageQuery.createdAt = new Date(createdAt.toString())
    }

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: LanguageModel })

    let language: Array<Language> = await LanguageModel.find(languageQuery)

    if (language) {
        return responseHandler({res: res, status: true, statusCode: 200, data: language, metaData: paginationData })
    }

    return next(new ErrorResponse('No registered language found.', 404))

})