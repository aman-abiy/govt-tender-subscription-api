"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../utils/types/enums");
const schema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Tender',
            required: false,
            default: []
        }],
    subscriptions: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false,
        default: null
    },
    pendingSubscription: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false,
        default: null
    },
    alertCategories: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Category',
            required: false,
            default: []
        }],
    alertRegions: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Region',
            required: false,
            default: []
        }],
    alertLanguages: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Language',
            required: false,
            default: []
        }],
    roles: {
        type: [String],
        enum: enums_1.ACCOUNT_TYPES,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account',
        required: false
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account',
        required: false,
        default: null
    },
    createdAt: {
        type: Date,
        required: true,
        // default: new Date(Date.now())
    }
});
exports.AccountModel = mongoose_1.default.model('Account', schema);
