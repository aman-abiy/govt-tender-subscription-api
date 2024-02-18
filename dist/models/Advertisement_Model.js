"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertisementModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../utils/types/enums");
const schema = new mongoose_1.default.Schema({
    bannerTitle: {
        type: String,
        required: true
    },
    bannerDescription: {
        type: String,
        required: false
    },
    hyperlink: {
        type: String,
        required: false
    },
    bannerImage: {
        type: String,
        required: false
    },
    themeColorHex: {
        type: String,
        required: false
    },
    company: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Company',
        required: false
    },
    type: {
        type: String,
        enum: enums_1.ADVERTISEMENT_TYPES,
        required: true,
    },
    isFeatured: {
        type: Boolean,
        required: true,
        default: true
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
exports.AdvertisementModel = mongoose_1.default.model('Advertisement', schema);
