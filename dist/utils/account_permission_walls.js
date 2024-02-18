"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitBelowEncoderAndEditorRoles = exports.limitBelowSalesCoordinatorRoles = exports.limitBelowAdminRoles = exports.limitBelowRootRoles = void 0;
const statics_config_1 = require("../config/statics.config");
/*
ROLES ARE HIERARCHIAL

This is the hierarchy order of roles
[root > admin > sales-coordinator > encoder > editor]

Therefore limiting role permission is by limiting users with roles below the given roles in the hierarchy.
*/
const limitBelowRootRoles = (userRole, errMsg) => {
    let rolePermission;
    const allowedRoles = ['root'];
    if (!userRole.some((e) => allowedRoles.includes(e))) {
        rolePermission = {
            status: false,
            msg: errMsg || statics_config_1.ROLE_PERMISSION_ERROR_MSG
        };
        return rolePermission;
    }
    return null;
};
exports.limitBelowRootRoles = limitBelowRootRoles;
const limitBelowAdminRoles = (userRole, errMsg) => {
    let rolePermission;
    const allowedRoles = ['root', 'admin'];
    if (!userRole.some((e) => allowedRoles.includes(e))) {
        rolePermission = {
            status: false,
            msg: errMsg || statics_config_1.ROLE_PERMISSION_ERROR_MSG
        };
        return rolePermission;
    }
    return null;
};
exports.limitBelowAdminRoles = limitBelowAdminRoles;
const limitBelowSalesCoordinatorRoles = (userRole, errMsg) => {
    let rolePermission;
    const allowedRoles = ['root', 'admin', 'sales-coordinator'];
    if (!userRole.some((e) => allowedRoles.includes(e))) {
        rolePermission = {
            status: false,
            msg: errMsg || statics_config_1.ROLE_PERMISSION_ERROR_MSG
        };
        return rolePermission;
    }
    return null;
};
exports.limitBelowSalesCoordinatorRoles = limitBelowSalesCoordinatorRoles;
const limitBelowEncoderAndEditorRoles = (userRole, errMsg) => {
    let rolePermission;
    const allowedRoles = ['root', 'admin', 'sales-coordinator', 'encoder', 'editor'];
    if (!userRole.some((e) => allowedRoles.includes(e))) {
        rolePermission = {
            status: false,
            msg: errMsg || statics_config_1.ROLE_PERMISSION_ERROR_MSG
        };
        return rolePermission;
    }
    return null;
};
exports.limitBelowEncoderAndEditorRoles = limitBelowEncoderAndEditorRoles;
