"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allStaffRoles = exports.aboveAndIncSalesRole = exports.aboveAndIncAdminRole = exports.rootRoles = void 0;
const error_response_1 = __importDefault(require("../../utils/error_response"));
const statics_config_1 = require("../../config/statics.config");
const classified_roles_1 = require("../../utils/classified_roles");
const rootRoles = (req, res, next) => {
    const user = req.user;
    if (!user.roles.some((e) => classified_roles_1.ROOT_ROLES.includes(e))) {
        return next(new error_response_1.default(statics_config_1.ROLE_PERMISSION_ERROR_MSG, 403));
    }
    next();
};
exports.rootRoles = rootRoles;
const aboveAndIncAdminRole = (req, res, next) => {
    const user = req.user;
    if (!user.roles.some((e) => classified_roles_1.ABOVE_AND_INC_ADMIN_ROLES.includes(e))) {
        return next(new error_response_1.default(statics_config_1.ROLE_PERMISSION_ERROR_MSG, 403));
    }
    next();
};
exports.aboveAndIncAdminRole = aboveAndIncAdminRole;
const aboveAndIncSalesRole = (req, res, next) => {
    const user = req.user;
    if (!user.roles.some((e) => classified_roles_1.ABOVE_AND_INC_SALES_ROLES.includes(e))) {
        return next(new error_response_1.default(statics_config_1.ROLE_PERMISSION_ERROR_MSG, 403));
    }
    next();
};
exports.aboveAndIncSalesRole = aboveAndIncSalesRole;
const allStaffRoles = (req, res, next) => {
    const user = req.user;
    if (!user.roles.some((e) => classified_roles_1.ALL_STAFF_ROLES.includes(e))) {
        return next(new error_response_1.default(statics_config_1.ROLE_PERMISSION_ERROR_MSG, 403));
    }
    next();
};
exports.allStaffRoles = allStaffRoles;
