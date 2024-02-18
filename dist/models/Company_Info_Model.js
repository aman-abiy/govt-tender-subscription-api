"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyInfoModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    name: {
        type: Object,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    region: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Region',
        required: false
    },
    country: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Country',
        required: false
    },
    phone1: {
        type: Object,
        required: false,
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
        type: Number,
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
    telegram: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: true
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
        default: new Date(Date.now())
    }
});
exports.CompanyInfoModel = mongoose_1.default.model('CompanyInfo', schema);
