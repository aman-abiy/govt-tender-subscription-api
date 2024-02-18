import mongoose from 'mongoose'
import { Response } from 'express';
import { SESSION_ACTIVITY_TYPES, sort } from './enums';
import CustomResponse from '../custom_response';

export type Pagination = {
    next: Object,
    prev: Object,
}

export type paginationParams = {
    queryPage: string,
    queryLimit: string,
    query?: any,
    Schema: mongoose.Model<any>
}

export type MetaData = {
    startIndex: number,
    limit: number,
    pagination: Pagination,
    currentPage: number,
    total: number
}

export type ResponseHandler = {
    res: any,
    status: boolean,
    statusCode: number,
    sessionToken?: string,
    link?: URL,
    data?: any,
    msg?: string,
    metaData?: MetaData
}

export type SubscriptionDates = {
    startDate: Date,
    endDate: Date
}

export interface InvoiceProduct {
    quantity: string,
    description: string,
    tax: string,
    price: number
}

export interface Name {
    en: string,
    am: string
}

export interface PaymentTotal {
    _id: string,
    totalPrice: number
}

export interface SessionActivity {
    type: SESSION_ACTIVITY_TYPES,
    tender?: mongoose.Types.ObjectId
    timestamp: Date,
    deviceInfo: Object
}

export const ALL_TENDERS = 'All_Tenders'
export const MY_TENDERS = 'My_Tenders'
export const FREE_TENDERS = 'Free_Tenders'
export const SAVED_TENDERS = 'Saved_Tenders'