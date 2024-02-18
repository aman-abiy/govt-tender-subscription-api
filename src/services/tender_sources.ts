import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/async_handler';
import TenderSource from '../interfaces/Tender_Source';
import { TenderSourceModel } from '../models/Tender_Source_Model';
import { tenderSourceBodyCast } from '../utils/types/request_body_dtos';
import { RolePermission, TenderSourceBody } from '../utils/types/method_return_dtos';
import { responseHandler } from '../utils/response_handler';
import { TenderSourceQuery } from '../utils/types/request_query_dtos';
import ErrorResponse from '../utils/error_response';
import Account from '../interfaces/Account';
import { paginationHandler } from '../utils/pagination';
import { limitBelowAdminRoles } from '../utils/account_permission_walls';
 
export const addTenderSources = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let tenderSourceBody: TenderSourceBody
    tenderSourceBody = tenderSourceBodyCast(req.body)

    tenderSourceBody.createdBy = user._id
    tenderSourceBody.createdAt = new Date(Date.now())
    
    let tenderSource: TenderSource = await TenderSourceModel.create(tenderSourceBody)

    if (tenderSource) {
        return responseHandler({res: res, status: true, statusCode: 201, data: tenderSource })
    }

    return next(new ErrorResponse('Could not add Tender Source.', 500))

})

export const editTenderSource = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let tenderSourceBody: TenderSourceBody
    tenderSourceBody = tenderSourceBodyCast(req.body)

    let tenderSource: TenderSource = await TenderSourceModel.findByIdAndUpdate(tenderSourceBody._id, tenderSourceBody, {
        new: true,
        runValidators: true
    })

    if (tenderSource) {
        return responseHandler({res: res, status: true, statusCode: 201, data: tenderSource })
    }

    return next(new ErrorResponse('Could not add tenderSource.', 500))

})

export const toggleActiveStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let tenderSourceBody: TenderSourceBody
    tenderSourceBody = tenderSourceBodyCast(req.body)

    let tenderSource: TenderSource = await TenderSourceModel.findById(tenderSourceBody._id)

    tenderSource = await TenderSourceModel.findByIdAndUpdate(tenderSourceBody._id, { isActive: !tenderSource.isActive }, {
        new: true,
        runValidators: true
    })

    if (tenderSource) {
        return responseHandler({res: res, status: true, statusCode: 201, data: tenderSource })
    }

    return next(new ErrorResponse('Could change Tender Source active status.', 500))

})

export const toggleDelete = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }
    
    let tenderSourceBody: TenderSourceBody
    tenderSourceBody = tenderSourceBodyCast(req.body)

    let tenderSource: TenderSource = await TenderSourceModel.findById(tenderSourceBody._id)

    tenderSource = await TenderSourceModel.findByIdAndUpdate(tenderSourceBody._id, { isDeleted: !tenderSource.isDeleted }, {
        new: true,
        runValidators: true
    })

    if (tenderSource) {
        return responseHandler({res: res, status: true, statusCode: 201, data: tenderSource })
    }

    return next(new ErrorResponse('Could not delete Tender Source.', 500))

})

export const getTenderSource = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    let {
        id,
        isActive,
        isDeleted,
        createdBy,
        createdAt,
        sort,
        page,
        limit
    } = req.query

    let tenderSourceQuery: TenderSourceQuery = {} as TenderSourceQuery
    tenderSourceQuery.isDeleted = false
    
    if (id) {
        tenderSourceQuery._id = new mongoose.Types.ObjectId(id.toString())
    }

    if (isActive != null) {
        tenderSourceQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        tenderSourceQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        tenderSourceQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        tenderSourceQuery.createdAt = new Date(createdAt.toString())
    }

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: TenderSourceModel })

    let tenderSource: Array<TenderSource> = await TenderSourceModel.find(tenderSourceQuery)

    if (tenderSource) {
        return responseHandler({res: res, status: true, statusCode: 201, data: tenderSource, metaData: paginationData })
    }

    return next(new ErrorResponse('No registered tenderSource found.', 404))

})