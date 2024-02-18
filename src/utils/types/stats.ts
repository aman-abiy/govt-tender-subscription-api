export interface UsersBySubscriptionStatus {
    active: number,
    pending: number,
    expired: number
    total: number
}

export interface UsersByService {
    mobileApp: number,
    webApp: number
}

export interface UsersLast10DaysCount {
    weekDays: Array<String>,
    counts: Array<number>
}

export interface SalesLast10DaysAmount {
    weekDays: Array<String>,
    saleAmountByDay: Array<number>
}

export interface SalesCurrentMonth {
    currentMonth: string,
    count: number
    saleAmount: number
}