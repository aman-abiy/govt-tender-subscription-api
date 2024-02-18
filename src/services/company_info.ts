import { Request, Response, NextFunction } from 'express';
import asyncHandler from "../middleware/async_handler"
import CompanyInfo from "../interfaces/Company_Info";
import { CompanyInfoModel } from '../models/Company_Info_Model';
import { CompanyInfoBody } from '../utils/types/method_return_dtos';
import { companyInfoBodyCast } from '../utils/types/request_body_dtos';
import { responseHandler } from '../utils/response_handler';
import ErrorResponse from '../utils/error_response';

export const addCompanyInfo = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    let companyInfoBody: CompanyInfoBody
    companyInfoBody = companyInfoBodyCast(req.body)

    const companyInfo: CompanyInfo = await CompanyInfoModel.create(companyInfoBody)

    if(companyInfo) {
        return responseHandler({ res: res, status: true, statusCode: 201, data: companyInfo })
    }

    return next(new ErrorResponse('Could not add Company Info. Try again.', 500))

})

export const getCompanyInfo = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const companyInfo: Array<CompanyInfo> = await CompanyInfoModel.find()

    if(companyInfo) {
        if(companyInfo[0]) {
            return responseHandler({ res: res, status: true, statusCode: 200, data: companyInfo[0] })
        }
        return next(new ErrorResponse('Company Info not found.', 404))
    }

    return next(new ErrorResponse('Could not get Company Info.', 500))

})