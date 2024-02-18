"use strict";
/*
ROLES ARE HIERARCHIAL

This is the hierarchy order of roles
[root > admin > sales-coordinator > encoder > editor]

Therefore limiting role permission is by limiting users with roles below the given roles in the hierarchy.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_STAFF_ROLES = exports.ABOVE_AND_INC_SALES_ROLES = exports.ABOVE_AND_INC_ADMIN_ROLES = exports.ROOT_ROLES = void 0;
exports.ROOT_ROLES = ['root'];
exports.ABOVE_AND_INC_ADMIN_ROLES = ['root', 'admin'];
exports.ABOVE_AND_INC_SALES_ROLES = ['root', 'admin', 'sales-coordinator'];
exports.ALL_STAFF_ROLES = ['root', 'admin', 'sales-coordinator', 'encoder', 'editor'];
