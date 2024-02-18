import mongoose from 'mongoose'
import IPayment from '../interfaces/Payment'

const schema = new mongoose.Schema<IPayment>({
    price: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false
    },
    paymentMethod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod',
        required: true
    },
    currency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency',
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    bank: {
        type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: false
    },
    createdAt: {
        type: Date,
        required: true,
        // default: new Date(Date.now())
    }
})

export const PaymentModel = mongoose.model<IPayment>('Payment', schema)