"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailResultModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../utils/types/enums");
const schema = new mongoose_1.default.Schema({
    account: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account',
        required: false
    },
    tenders: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Tender',
            required: false
        }],
    sentToEmail: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: enums_1.EMAIL_TYPES,
        required: true
    },
    isSent: {
        type: Boolean,
        required: true,
        default: false
    },
    readCheckKey: {
        type: Number,
        required: true
    },
    isOpened: {
        type: Boolean,
        required: true,
        default: false
    },
    openedAt: {
        type: Date,
        required: false
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        // default: new Date(Date.now())
    }
});
exports.EmailResultModel = mongoose_1.default.model('EmailResult', schema);
