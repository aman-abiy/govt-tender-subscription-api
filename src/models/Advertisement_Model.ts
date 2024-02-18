import mongoose from 'mongoose'
import IAdvertisement from '../interfaces/Advertisement'
import { ADVERTISEMENT_TYPES } from '../utils/types/enums'

const schema = new mongoose.Schema<IAdvertisement>({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: false
    },
    type: {
        type: String,
        enum: ADVERTISEMENT_TYPES,
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

export const AdvertisementModel = mongoose.model<IAdvertisement>('Advertisement', schema)
