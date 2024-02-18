import mongoose from 'mongoose'
import ISubscriptionPlan from '../interfaces/Subscription_Plan'

const schema = new mongoose.Schema<ISubscriptionPlan>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    vat: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    // length of time in milliseconds
    duration: {
        type: Number,
        required: true
    },
    isUserSelectable: {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountModel',
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountModel',
        required: false
    },
    createdAt: {
        type: Date,
        required: true,
        // default: new Date(Date.now())
    }
})

export const SubscriptionPlanModel = mongoose.model<ISubscriptionPlan>('SubscriptionPlan', schema)