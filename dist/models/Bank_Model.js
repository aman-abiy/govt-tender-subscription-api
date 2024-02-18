"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    iso3: {
        type: String,
        required: true
    },
    accountName: {
        type: String,
        required: false,
        // select: false,
    },
    accountNumber: {
        type: Number,
        required: false,
        unique: true
    },
    swiftCode: {
        type: String,
        required: false
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
    isUserViewable: {
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
        // default: new Date(Date.now())
    }
});
exports.BankModel = mongoose_1.default.model('Bank', schema);
