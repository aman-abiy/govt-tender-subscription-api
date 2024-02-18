import mongoose from 'mongoose'
import IAccount from '../interfaces/Account'
import { ACCOUNT_TYPES } from '../utils/types/enums'

const schema = new mongoose.Schema<IAccount>({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        unique: true
    },
    mobile: {
        type: Object,
        required: false,
        unique: true
    },
    password: {
        type: String,
        select: false,
        minlength: [6, 'Password should be at least 6 characters long'],
        required: true
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tender',
        required: false,
        default: []
    }],
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false,
        default: []
    }],
    // for mobile login & verification
    OTP_Code: {
        type: Number,
        required: false
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: false,
        default: null
    },
    hasActiveSubscription: {
        type: Boolean,
        required: true,
        default: false
    },
    lastActiveSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false,
        default: null
    },
    pendingSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false,
        default: null
    },
    alertCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
        default: []
    }],
    alertRegions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: false,
        default: []
    }],
    alertLanguages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language',
        required: false,
        default: []
    }],
    roles: {
        type: [String],
        enum: ACCOUNT_TYPES,
        required: true,
        default: ['user']
    },
    alertStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    verificationToken: {
        type: String,
        required: false,
        default: null
    },
    passwordResetToken: {
        type: String,
        required: false,
        select: false,
        default: null
    },
    passwordResetExpiryAt: {
        type: Date,
        required: false
    },
    sessionToken: {
        type: String,
        required: false,
        default: null
    },
    fcmToken: {
        type: String,
        required: false,
        default: null
    },
    mobileDeviceInfo: {
        type: Object,
        required: false,
        select: false,
        default: null
    },
    // sessionActivity, login and logout records
    /* object format = {
        type: SESSION_ACTIVITY_TYPES,
        timestamp: Date,
        deviceInfo: Object
    } */
    sessionActivity: {
        type: [Object],
        required: false,
        select: false,
        default: []
    },
    lastUpdatedAt: {
        type: Date,
        required: false,
        default: null
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: false,
        default: null
    },
    createdAt: {
        type: Date,
        required: true,
        // default: new Date(Date.now())
    }
})

export const AccountModel = mongoose.model<IAccount>('Account', schema)
