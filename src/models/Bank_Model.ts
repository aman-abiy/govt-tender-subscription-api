import mongoose from 'mongoose'
import IBank from '../interfaces/Bank'

const schema = new mongoose.Schema<IBank>({
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

export const BankModel = mongoose.model<IBank>('Bank', schema)
