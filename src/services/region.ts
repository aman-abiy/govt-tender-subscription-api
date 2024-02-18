import mongoose from 'mongoose';
import slug from 'slug';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/async_handler'
import { RegionBody, RolePermission } from '../utils/types/method_return_dtos';
import { regionBodyCast } from '../utils/types/request_body_dtos';
import { RegionModel } from '../models/Region_Model';
import { RegionQuery } from '../utils/types/request_query_dtos';
import Region from '../interfaces/Region';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import Account from '../interfaces/Account';
import { paginationHandler } from '../utils/pagination';
import { limitBelowAdminRoles } from '../utils/account_permission_walls';

export const addRegion = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }
    
    let regionBody: RegionBody
    regionBody = regionBodyCast(req.body)

    regionBody.slug = slug(regionBody.name.en)
    regionBody.createdAt = new Date(Date.now())
    regionBody.createdBy = user._id

    let region: Region = await RegionModel.create(regionBody)

    if (region) {
        return responseHandler({res: res, status: true, statusCode: 201, data: region })
    }

    return next(new ErrorResponse('Could not add region.', 500))

})

export const editRegion = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let regionBody: RegionBody
    regionBody = regionBodyCast(req.body)

    regionBody.slug = slug(regionBody.name.en)

    let region: Region = await RegionModel.findByIdAndUpdate(regionBody._id, regionBody, {
        new: true,
        runValidators: true
    })

    if (region) {
        return responseHandler({res: res, status: true, statusCode: 201, data: region })
    }

    return next(new ErrorResponse('Could not add region.', 500))

})

export const toggleActiveStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }

    let regionBody: RegionBody
    regionBody = regionBodyCast(req.body)

    let region: Region = await RegionModel.findById(regionBody._id)

    region = await RegionModel.findByIdAndUpdate(regionBody._id, { isActive: !region.isActive }, {
        new: true,
        runValidators: true
    })

    if (region) {
        return responseHandler({res: res, status: true, statusCode: 201, data: region })
    }

    return next(new ErrorResponse('Could not add region.', 500))

})

export const toggleDelete = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    let rolePermission: RolePermission = limitBelowAdminRoles(user.roles)
    if (rolePermission) {
        return next(new ErrorResponse(rolePermission.msg, 500))
    }
    
    let regionBody: RegionBody
    regionBody = regionBodyCast(req.body)

    let region: Region = await RegionModel.findById(regionBody._id)

    region = await RegionModel.findByIdAndUpdate(regionBody._id, { isDeleted: !region.isDeleted }, {
        new: true,
        runValidators: true
    })

    if (region) {
        return responseHandler({res: res, status: true, statusCode: 201, data: region })
    }

    return next(new ErrorResponse('Could not add region.', 500))

})

export const getRegion = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
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

    let regionQuery: RegionQuery = {} as RegionQuery
    regionQuery.isDeleted = false

    if (id) {
        regionQuery._id = new mongoose.Types.ObjectId(id.toString())
    }

    if (slug) {
        regionQuery.slug = { "$regex": slug, "$options": "i" }
    }

    if (isActive != null) {
        regionQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        regionQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        regionQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        regionQuery.createdAt = new Date(createdAt.toString())
    }

    console.log('regionQuery ', regionQuery)

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: RegionModel })


    let region: Array<Region> = await RegionModel.find(regionQuery)

    if (region) {
        return responseHandler({res: res, status: true, statusCode: 201, data: region, metaData: paginationData })
    }

    return next(new ErrorResponse('No registered region found.', 404))

})