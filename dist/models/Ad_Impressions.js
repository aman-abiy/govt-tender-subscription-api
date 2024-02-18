"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdImpressionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../utils/types/enums");
const schema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: enums_1.AD_IMPRESSION_TYPES,
        required: true
    },
    advertisement: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Advertisement',
        required: true
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
exports.AdImpressionModel = mongoose_1.default.model('AdImpression', schema);
