import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import { sort } from './enums';
import { Name } from './type_constants';

export type InvoiceReturn = {
    invoiceId: number,
    fileName: string
}

export interface SubscriptionBody {
    _id?: mongoose.Types.ObjectId,
    account?: mongoose.Types.ObjectId,
    isPaid?: boolean,
    paymentMethod?: mongoose.Types.ObjectId,
    currency?: mongoose.Types.ObjectId,
    payment?: mongoose.Types.ObjectId,
    paymentDate?: Date,
    bank?: mongoose.Types.ObjectId,
    isPending?: boolean,
    isActive?: boolean,
    invoiceId?: number,
    invoicePDF?: string,
    transactionRef?: string,
    subscriptionPlan?: mongoose.Types.ObjectId,
    startDate?: Date,
    endDate?: Date,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdAt?: Date,
    createdBy: mongoose.Types.ObjectId
}

export interface AlertCategoryBody {
    categories: Array<mongoose.Types.ObjectId>
}

export interface MailOptions {
    from: string,
    to: string,
    subject: string,
    html: string
}

export interface SendEmailResponse {
    type: string,
    error?: Error,
    info: nodemailer.SentMessageInfo
}

export interface LanguageBody {
    _id?: mongoose.Types.ObjectId,
    iso: string,
    iso3: string,
    name: string,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdAt?: Date,
    createdBy: mongoose.Types.ObjectId
}

export interface RegionBody {
    _id?: mongoose.Types.ObjectId,
    name: Name,
    slug: string,
    country: mongoose.Types.ObjectId,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdAt?: Date,
    createdBy: mongoose.Types.ObjectId
}

export interface CountryBody {
    _id?: mongoose.Types.ObjectId,
    name?: Name,
    slug?: string,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdAt?: Date,
    createdBy?: mongoose.Types.ObjectId
}

export interface TenderSourceBody {
    _id?: mongoose.Types.ObjectId,
    name: Name,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdAt?: Date,
    createdBy: mongoose.Types.ObjectId
}

export interface TenderBody {
    _id?: mongoose.Types.ObjectId,
    // contains device name and IP address
    deviceInfo?: Object,
    site_id?: string,
    region?: mongoose.Types.ObjectId,
    language?: mongoose.Types.ObjectId,
    tenderSources?: Array<mongoose.Types.ObjectId>,
    categories?: Array<mongoose.Types.ObjectId>,
    company?:  mongoose.Types.ObjectId,
    bidBond?: string,
    bidOpeningDate?: Date,
    bidClosingDate?: Date,
    isPublished?: boolean,
    isFeatured?: boolean,
    isActive?: boolean,
    isDeleted?: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export interface AccountBody {
    _id?: mongoose.Types.ObjectId,
    fname?: string,
    lname?: string,
    email?: string,
    mobile?: Object,
    password?: string,
    fcmToken?: string,
    mobileDeviceInfo?: Object,
    // contains device name and IP address
    deviceInfo?: Object,
    company?: mongoose.Types.ObjectId,
    roles?: Array<string>,
    alertStatus?: boolean,
    alertRegions?: Array<mongoose.Types.ObjectId>,
    alertLanguages?: Array<mongoose.Types.ObjectId>,
    alertCategories?: Array<mongoose.Types.ObjectId>,
    isActive?: boolean,
    isDeleted?: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export interface RolePermission {
    status: boolean,
    msg: string
}

export interface BankBody {
    _id?: mongoose.Types.ObjectId,
    name: string,
    iso3: string,
    accountName: string,
    accountNumber: number,
    swiftCode: string,
    isActive: boolean,
    isDeleted: boolean,
    isUserViewable?: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export interface PaymentMethodBody {
    _id?: mongoose.Types.ObjectId,
    name: string,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export interface CurrencyBody {
    _id?: mongoose.Types.ObjectId,
    name: string,
    iso3: string,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export interface SubscriptionPlanBody {
    _id?: mongoose.Types.ObjectId,
    name: string,
    price: number,
    vat: number,
    totalPrice: number,
    duration: number,
    isUserSelectable: boolean,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export interface EmailResultBody {
    _id?: mongoose.Types.ObjectId,
    account?: mongoose.Types.ObjectId,
    tenders: Array<mongoose.Types.ObjectId>,
    sentToEmail: string,
    type: string,
    isSent: boolean,
    readCheckKey: number,
    isOpened: boolean,
    openedAt?: Date
    isDeleted: boolean,
    createdAt?: Date
}

export interface CompanyInfoBody {
    _id?: mongoose.Types.ObjectId,
    name?: string,
    address?: string,
    region?: mongoose.Types.ObjectId,
    country?: mongoose.Types.ObjectId,
    phone1?: Object,
    phone2?: Object,
    phone3?: Object,
    tin?: number,
    email?: string,
    website?: string,
    telegram?: string,
    isActive?: boolean,
    isDeleted?: boolean,
    createdAt?: Date
}

export interface CompanyBody {
    _id?: mongoose.Types.ObjectId,
    name: string,
    address: string,
    description?: string,
    region?: mongoose.Types.ObjectId,
    country?: mongoose.Types.ObjectId,
    phone1: Object,
    phone2?: Object,
    phone3?: Object,
    tin?: number,
    email?: string,
    website?: string,
    isActive?: boolean,
    isDeleted?: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId
    createdAt?: Date
}

export interface AdvertisementBody {
    _id?: mongoose.Types.ObjectId,
    bannerTitle: string,
    bannerDescription: string,
    hyperlink: string,
    bannerImage: string,
    themeColorHex: string,
    company: mongoose.Types.ObjectId,
    type: string,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export interface AdImpressionBody {
    _id?: mongoose.Types.ObjectId,
    type: string,
    advertisement: mongoose.Types.ObjectId
    isActive: boolean,
    isDeleted: boolean,
    createdBy?: mongoose.Types.ObjectId,
    createdAt?: Date
}

export interface BookmarkedTenderBody {
    _id?: mongoose.Types.ObjectId,
    account: mongoose.Types.ObjectId,
    tender: mongoose.Types.ObjectId,
    isRemoved?: boolean,
    isDeleted?: boolean,
    lastUpdatedAt?: Date,
    createdAt?: Date
}