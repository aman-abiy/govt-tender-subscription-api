import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncHandler from '../middleware/async_handler';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';
import { BankBody } from '../utils/types/method_return_dtos';
import { bankBodyCast } from '../utils/types/request_body_dtos';
import { BankModel } from '../models/Bank_Model';
import Bank from "../interfaces/Bank";
import Account from "../interfaces/Account";
import { paginationHandler } from '../utils/pagination';
import { BankQuery } from "../utils/types/request_query_dtos";

export const addBankAccount = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let bankBody: BankBody
    bankBody = bankBodyCast(req.body)
    bankBody.createdAt = new Date(Date.now())
    bankBody.createdBy = new mongoose.Types.ObjectId(user._id)

    let bank: Bank = await BankModel.create(bankBody)

    if(bank) {
        return responseHandler({res: res, status: true, statusCode: 201, data: bank })
    }

    return next(new ErrorResponse('Could not add bank account, please try again.', 500))
})

export const editBankAccount = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let bankBody: BankBody
    bankBody = bankBodyCast(req.body)

    bankBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    bankBody.lastUpdatedAt = new Date(Date.now())

    let bank: Bank = await BankModel.findById(bankBody._id)
    delete bankBody._id

    if(bank) {
        bank = await BankModel.findByIdAndUpdate(bank._id, bankBody, {
            new: true,
            runValidators: true
        }).select({ accountName: 1 })
        if(bank) {
            return responseHandler({res: res, status: true, statusCode: 200, data: bank })
        }

        return next(new ErrorResponse('Could not update bank account, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find bank account, please try again.', 404))
})

export const toggleActiveStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let bankBody: BankBody
    bankBody = bankBodyCast(req.body)

    bankBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    bankBody.lastUpdatedAt = new Date(Date.now())

    let bank: Bank = await BankModel.findById(bankBody._id)
    delete bankBody._id

    if(bank) {
        bank = await BankModel.findByIdAndUpdate(bank._id, { isActive: !bank.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        })
        if(bank) {
            return responseHandler({res: res, status: true, statusCode: 200, data: bank })
        }

        return next(new ErrorResponse('Could not update bank account, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find bank account, please try again.', 404))
})

export const toggleDelete = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let user: Account = req.user

    let bankBody: BankBody
    bankBody = bankBodyCast(req.body)

    bankBody.lastUpdatedBy = new mongoose.Types.ObjectId(user._id)
    bankBody.lastUpdatedAt = new Date(Date.now())

    let bank: Bank = await BankModel.findById(bankBody._id)
    delete bankBody._id

    if(bank) {
        bank = await BankModel.findByIdAndUpdate(bank._id, { isDeleted: !bank.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        })
        if(bank) {
            return responseHandler({res: res, status: true, statusCode: 200, data: bank })
        }

        return next(new ErrorResponse('Could not toggle delete bank account, please try again.', 500))
    }
    return next(new ErrorResponse('Could not find bank account, please try again.', 404))
})

export const getBankAccount = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    
    let {
        _id,
        name,
        accountName,
        accountNumber,
        swiftCode,
        isActive,
        isDeleted,
        isUserViewable,
        createdBy,
        createdAt,
        selectField,
        sort,
        page,
        limit
    } = req.query

    let bankQuery: BankQuery = {} as BankQuery
    bankQuery.isDeleted = false

    if (_id) {
        bankQuery._id = new mongoose.Types.ObjectId(_id.toString())
    }

    if (name) {
        bankQuery.name = { "$regex": name, "$options": "i" }
    }

    if (accountName) {
        bankQuery.accountName = { "$regex": accountName, "$options": "i" }
    }

    if (accountNumber) {
        bankQuery.accountNumber = parseInt(accountNumber.toString())
    }

    if (swiftCode) {
        bankQuery.swiftCode = swiftCode.toString()
    }

    if (isActive != null) {
        bankQuery.isActive = (isActive == 'true' ? true : false);
    }

    if (isDeleted != null) {
        bankQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }

    if (isUserViewable != null) {
        bankQuery.isUserViewable = (isUserViewable == 'true' ? true : false);
    }

    if (createdBy) {
        bankQuery.createdBy = new mongoose.Types.ObjectId(createdBy.toString())
    }

    if (createdAt) {
        bankQuery.createdAt = new Date(createdAt.toString())
    }

    if (selectField != null) {
        selectField = selectField.toString();
    }

    const paginationData = await paginationHandler({ queryPage: page?.toString(), queryLimit: limit?.toString(), Schema: BankModel })

    let banks: Array<Bank> = await BankModel.find(bankQuery).select(selectField)

    if (banks) {
        return responseHandler({res: res, status: true, statusCode: 200, data: banks, metaData: paginationData })
    }

    return next(new ErrorResponse('No registered bank accounts found.', 404))

})