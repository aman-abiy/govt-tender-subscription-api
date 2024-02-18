"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    price: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true
    },
    subscription: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false
    },
    paymentMethod: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'PaymentMethod',
        required: true
    },
    currency: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Currency',
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    bank: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Bank',
        required: true
    },
    transactionRef: {
        type: String,
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
exports.PaymentModel = mongoose_1.default.model('Payment', schema);
