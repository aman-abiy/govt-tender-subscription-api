import { Request, Response, NextFunction } from 'express';
import asyncHandler from "../middleware/async_handler"
import Category from '../interfaces/Category';
import mongoose from 'mongoose';
import { CategoryModel } from '../models/Category_Model';
import { responseHandler } from '../utils/response_handler';
import { CategoryQuery } from '../utils/types/request_query_dtos';
import { paginationHandler } from '../utils/pagination';
import ErrorResponse from '../utils/error_response';
const rawCategories = require('../../categories.json')

export const importAllCategories = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let category: Category = {} as Category
    let childCategory: Category = {} as Category
    let categories: Array<Category> = []
    let childCategories: Array<Category> = []

    rawCategories.forEach((e: any) => {
        category._id = new mongoose.Types.ObjectId(e.id)
        category.name = e.name
        if(e.children != null) {
            if(e.children.length > 0) { 
                category.isParent = true
                category.hasParent = false
                category.children = e.children.map((e: string) => new mongoose.Types.ObjectId(e))
                category.createdAt = new Date(Date.now())
                category.createdBy = new mongoose.Types.ObjectId('6218c6437afaa15c03330f95')
                e.children.forEach((e: any) => {
                    childCategory._id = e.id
                    childCategory.name = e.name
                    childCategory.isParent = false
                    childCategory.hasParent = true
                    childCategory.children = e.children
                    childCategory.createdAt = new Date(Date.now())
                    childCategory.createdBy = new mongoose.Types.ObjectId('6218c6437afaa15c03330f95')
                    childCategories.push(childCategory)
                    childCategory = {} as Category
                })
            } else { 
                category.isParent = false
                category.hasParent = false
            }
        } else {
            category.isParent = true
            category.hasParent = false
            category.children = []
            category.createdAt = new Date(Date.now())
            category.createdBy = new mongoose.Types.ObjectId('6218c6437afaa15c03330f95')
        }
        categories.push(category)
        category = {} as Category
    });

    childCategories.forEach((e) => categories.push(e))
    // categories.forEach((e) => {
    //     if(e.isParent == null) { 
    //         console.log(e.name)

    //     }
    // })

    console.log(categories.length)

    let insertedCategories: Array<Category> = await CategoryModel.insertMany(categories)
    
    if(insertedCategories != null) {
        return responseHandler({res: res, status: true, statusCode: 201, data: insertedCategories })
    }
})

export const getCategory = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let {
        id,
        isParent,
        isActive,
        isDeleted,
        createdBy,
        createdAt,
        sort,
        page,
        limit
    } = req.query  

    let categoryQuery: CategoryQuery = {} as CategoryQuery
    categoryQuery.or = [{ isParent: true }, { hasParent: false }]
    categoryQuery.isDeleted = false

    if (id) {
        categoryQuery._id = new mongoose.Types.ObjectId(id.toString())
    }

    if (isParent != null) {
        categoryQuery.isParent = (isParent == 'true' ? true : false);
    }

    if (isActive != null) {
        categoryQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        categoryQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (createdBy) {
        categoryQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        categoryQuery.createdAt = new Date(createdAt.toString())
    }

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: CategoryModel })

    const categories: Array<Category> = await CategoryModel.find({ ...categoryQuery, $or: categoryQuery.or })
        .populate('children');

    if(categories)  {
        return responseHandler({res: res, status: true, statusCode: 200, data: categories, metaData: paginationData })
    }

    return next(new ErrorResponse('No Tender Category found.', 404))

})
 