import { ROLE_PERMISSION_ERROR_MSG } from "../config/statics.config"
import { RolePermission } from "./types/method_return_dtos"

/*
ROLES ARE HIERARCHIAL

This is the hierarchy order of roles
[root > admin > sales-coordinator > encoder > editor]

Therefore limiting role permission is by limiting users with roles below the given roles in the hierarchy.
*/

export const limitBelowRootRoles = (userRole: Array<string>, errMsg?: string ) : RolePermission => {
    let rolePermission : RolePermission

    const allowedRoles = ['root']

    if (!userRole.some((e) => allowedRoles.includes(e))) {
        rolePermission = {
            status: false,
            msg: errMsg || ROLE_PERMISSION_ERROR_MSG
        }

        return rolePermission
    }

    return null
}

export const limitBelowAdminRoles = (userRole: Array<string>, errMsg?: string ) : RolePermission => {
    let rolePermission : RolePermission

    const allowedRoles = ['root', 'admin']

    if (!userRole.some((e) => allowedRoles.includes(e))) {
        rolePermission = {
            status: false,
            msg: errMsg || ROLE_PERMISSION_ERROR_MSG
        }

        return rolePermission
    }

    return null
}

export const limitBelowSalesCoordinatorRoles = (userRole: Array<string>, errMsg?: string ) : RolePermission => {
    let rolePermission : RolePermission

    const allowedRoles = ['root', 'admin', 'sales-coordinator']

    if (!userRole.some((e) => allowedRoles.includes(e))) {
        rolePermission = {
            status: false,
            msg: errMsg || ROLE_PERMISSION_ERROR_MSG
        }

        return rolePermission
    }

    return null
}

export const limitBelowEncoderAndEditorRoles = (userRole: Array<string>, errMsg?: string ) : RolePermission => {
    let rolePermission : RolePermission

    const allowedRoles = ['root', 'admin', 'sales-coordinator', 'encoder', 'editor']

    if (!userRole.some((e) => allowedRoles.includes(e))) {
        rolePermission = {
            status: false,
            msg: errMsg || ROLE_PERMISSION_ERROR_MSG
        }

        return rolePermission
    }

    return null
}