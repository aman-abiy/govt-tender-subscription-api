export enum sort {
    'asc',
    'desc'
}

export enum EMAIL_TYPES {
    'alert',
    'auth'
}

export enum ACCOUNT_TYPES {
    'root', 
    'admin', 
    'sales-coordinator', 
    'encoder', 
    'editor', 
    'user'
}

export enum ADVERTISEMENT_TYPES {
    'card',
    'banner'
}

export enum AD_IMPRESSION_TYPES {
    'view',
    'click'
}

export type SESSION_ACTIVITY_TYPES = 'tender-view' | 'agent-created-account' | 'agent-updated-account' | 'agent-deleted-account' | 'signup' | 'updated-account' | 'email-verification-request' | 'email-verified' | 'reset-password-request' | 'reset-password' | 'login' | 'logout'

export type TENDER_QUERY_TYPES = 'All_Tenders' | 'My_Tenders' | 'Free_Tenders' | 'Saved_Tenders' | null
export type TENDER_STATUSES = 'open' | 'closed' | null
