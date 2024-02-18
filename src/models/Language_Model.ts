import mongoose from 'mongoose'
import ILanguage from '../interfaces/Language'

const schema = new mongoose.Schema<ILanguage>({
    iso: {
        type: String,
        required: true,
        unique: true
    },
    iso3: {
        type: String,
        required: true,
        unique: true
    },
    name: {
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

export const LanguageModel = mongoose.model<ILanguage>('Language', schema)