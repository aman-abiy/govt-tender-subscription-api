import mongoose from 'mongoose'
import { sort, TENDER_QUERY_TYPES, TENDER_STATUSES } from './enums';
import { Name } from './type_constants';

export type SubscriptionQuery = {
    _id: mongoose.Types.ObjectId,
    account: mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    subscriptionPlan: mongoose.Types.ObjectId,
    isActive: boolean,
    isDeleted: boolean,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date,
    sort: sort,
    page: number,
    limit: number
}

export type TenderQuery = {
    _id: mongoose.Types.ObjectId,
    site_id: string,
    type?: TENDER_QUERY_TYPES,
    title: Object,
    region: Object,
    language: Object,
    tenderSources: Object,
    categories: Object,
    $and: Array<any>,
    company:  mongoose.Types.ObjectId,
    bidBond: string,
    bidOpeningDate: Object,
    bidClosingDate: Object,
    isPublished: boolean,
    isFeatured: boolean,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt: Date,
    lastUpdatedBy: mongoose.Types.ObjectId
    createdBy: mongoose.Types.ObjectId,
    createdAt: Object,
    status?: TENDER_STATUSES,
    selectFields: Object,
    sort: sort,
    page: number,
    limit: number
}

export type CountryQuery = {
    _id: mongoose.Types.ObjectId,
    slug: Object,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt: Date,
    lastUpdatedBy: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date,
    sort: sort,
    page: number,
    limit: number
}

export type RegionQuery = {
    _id: mongoose.Types.ObjectId,
    slug: Object,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt: Date,
    lastUpdatedBy: mongoose.Types.ObjectId
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date,
    sort: sort,
    page: number,
    limit: number
}

export type LanguageQuery = {
    _id: mongoose.Types.ObjectId,
    iso: string,
    iso3: string,
    name: string,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt: Date,
    lastUpdatedBy: mongoose.Types.ObjectId
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date,
    sort: sort,
    page: number,
    limit: number
}

export type TenderSourceQuery = {
    _id: mongoose.Types.ObjectId,
    name: Name,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt: Date,
    lastUpdatedBy: mongoose.Types.ObjectId
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date,
    sort: sort,
    page: number,
    limit: number
}

export type CategoryQuery = {
    _id: mongoose.Types.ObjectId,
    isParent: boolean,
    hasParent: boolean,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt: Date,
    lastUpdatedBy: mongoose.Types.ObjectId
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date,
    or: Array<Object>,
    sort: sort,
    page: number,
    limit: number
}

export type mobile = {
    e164: object
}

export type AccountQuery = {
    _id?: mongoose.Types.ObjectId,
    fname?: Object,
    lname?: Object,
    email?: Object,
    mobile?: mobile,
    company?: mongoose.Types.ObjectId,
    roles?: Object,
    hasActiveSubscription?: boolean,
    lastActiveSubscription: Object,
    alertStatus?: boolean,
    sessionActivity?: Object,
    isActive?: boolean,
    isDeleted?: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date,
}

export type BankQuery = {
    _id?: mongoose.Types.ObjectId,
    name: Object,
    accountName: Object,
    accountNumber: number,
    swiftCode: string,
    isActive: boolean,
    isDeleted: boolean,
    isUserViewable: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export type PaymentQuery = {
    _id?: mongoose.Types.ObjectId,
    bank: mongoose.Types.ObjectId,
    paymentMethod: mongoose.Types.ObjectId,
    transactionRef: string,
    isPaid: boolean,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export type PaymentMethodQuery = {
    _id?: mongoose.Types.ObjectId,
    name: Object,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export type CurrencyQuery = {
    _id?: mongoose.Types.ObjectId,
    name: Object,
    iso3: string,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export interface SubscriptionPlanQuery {
    _id?: mongoose.Types.ObjectId,
    name: string,
    price: number,
    totalPrice: number,
    isUserSelectable: boolean,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export interface EmailResultQuery {
    _id?: mongoose.Types.ObjectId,
    account?: mongoose.Types.ObjectId,
    type: string,
    isSent: boolean,
    readCheckKey: number,
    isOpened: boolean,
    isDeleted: boolean,
    createdAt?: Date
}

export interface CommissionsQuery {
    isPaid?: boolean,
    startDate?: Date,
    endDate?: Date,
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Object,
    // out of 100
    commissionPercentage?: number,
    bonusThreshold?: number,
}

export interface EmailPromoQuery {
    startIndex: number,
    endIndex: number,
}

export interface CompanyQuery {
    _id?: mongoose.Types.ObjectId,
    name?: Object,
    address?: Object,
    description?: string,
    region?: mongoose.Types.ObjectId,
    country?: mongoose.Types.ObjectId,
    phone1?: Object,
    phone2?: Object,
    phone3?: Object,
    tin?: Object,
    email?: Object,
    website?: string,
    isActive?: boolean,
    isDeleted?: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export type AdvertisementQuery = {
    _id?: mongoose.Types.ObjectId,
    bannerTitle?: Object,
    bannerDescription?: Object,
    hyperlink: number,
    company?: mongoose.Types.ObjectId,
    type?: string,
    isActive?: boolean,
    isDeleted?: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export type AdImpressionQuery = {
    _id?: mongoose.Types.ObjectId,
    type: string,
    advertisement?: mongoose.Types.ObjectId,
    isActive?: boolean,
    isDeleted?: boolean,
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export type BookmarkedTenderQuery = {
    _id?: mongoose.Types.ObjectId,
    account?: mongoose.Types.ObjectId,
    tender?: mongoose.Types.ObjectId,
    isRemoved?: boolean,
    isDeleted?: boolean
    lastUpdatedAt?: Date,
    createdAt?: Date
}