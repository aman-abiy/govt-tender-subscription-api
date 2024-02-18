/*
ROLES ARE HIERARCHIAL

This is the hierarchy order of roles
[root > admin > sales-coordinator > encoder > editor]

Therefore limiting role permission is by limiting users with roles below the given roles in the hierarchy.
*/

export const ROOT_ROLES = ['root']
export const ABOVE_AND_INC_ADMIN_ROLES = ['root', 'admin']
export const ABOVE_AND_INC_SALES_ROLES = ['root', 'admin', 'sales-coordinator']
export const ALL_STAFF_ROLES = ['root', 'admin', 'sales-coordinator', 'encoder', 'editor']
