"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkedTenderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    account: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Account',
        required: false
    },
    tender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Tender',
        required: false
    },
    isRemoved: {
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
        required: true,
        default: new Date(Date.now())
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(Date.now())
    }
});
exports.BookmarkedTenderModel = mongoose_1.default.model('BookmarkedTender', schema);
