import { Request, Response, NextFunction } from "express";
import Account from '../interfaces/Account';
import ErrorResponse from '../utils/error_response';
import { ROLE_PERMISSION_ERROR_MSG } from '../config/statics.config';
import { ABOVE_AND_INC_ADMIN_ROLES, ABOVE_AND_INC_SALES_ROLES, ALL_STAFF_ROLES, ROOT_ROLES } from '../utils/classified_roles';

export const rootRoles = (req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    if (!user.roles.some((e) => ROOT_ROLES.includes(e))) {
        return next(new ErrorResponse(ROLE_PERMISSION_ERROR_MSG, 403))

    }
    next()
}

export const aboveAndIncAdminRole = (req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    if (!user.roles.some((e) => ABOVE_AND_INC_ADMIN_ROLES.includes(e))) {
        return next(new ErrorResponse(ROLE_PERMISSION_ERROR_MSG, 403))

    }
    next()
}

export const aboveAndIncSalesRole = (req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    if (!user.roles.some((e) => ABOVE_AND_INC_SALES_ROLES.includes(e))) {
        return next(new ErrorResponse(ROLE_PERMISSION_ERROR_MSG, 403))

    }
    next()
}

export const allStaffRoles = (req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    if (!user.roles.some((e) => ALL_STAFF_ROLES.includes(e))) {
        return next(new ErrorResponse(ROLE_PERMISSION_ERROR_MSG, 403))

    }
    next()
}

