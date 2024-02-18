"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    name: {
        type: Object,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    region: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    },
    country: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    phone1: {
        type: Object,
        required: true,
        default: null
    },
    phone2: {
        type: Object,
        required: false,
        default: null
    },
    phone3: {
        type: Object,
        required: false,
        default: null
    },
    tin: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    // for corporate tender subscription plan
    lastActiveSubscription: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false,
        default: null
    },
    subscriptions: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Subscription',
            required: false,
            default: []
        }],
    // for advertisment subscription plan
    lastActiveAdSubscription: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false,
        default: null
    },
    pendingAdSubscription: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false,
        default: null
    },
    adSubscriptions: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Subscription',
            required: false,
            default: []
        }],
    hasActiveAdSubscription: {
        type: Boolean,
        required: true,
        default: false
    },
    //
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
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
        required: false
    },
    createdAt: {
        type: Date,
        required: true,
        // default: new Date(Date.now())
    }
});
exports.CompanyModel = mongoose_1.default.model('Company', schema);
