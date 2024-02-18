import mongoose from 'mongoose'
import IAdImpression from '../interfaces/Ad_Impression'
import { AD_IMPRESSION_TYPES } from '../utils/types/enums'

const schema = new mongoose.Schema<IAdImpression>({
    type: {
        type: String,
        enum: AD_IMPRESSION_TYPES,
        required: true
    },
    advertisement: {
        type: mongoose.Schema.Types.ObjectId,
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

export const AdImpressionModel = mongoose.model<IAdImpression>('AdImpression', schema)
