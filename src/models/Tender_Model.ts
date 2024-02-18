import mongoose from 'mongoose'
import { countries, regions } from '../config/statics.config'
import ITender from '../interfaces/Tender'

const schema = new mongoose.Schema<ITender>({
    // id is the id from the site, just to control redundancy
    site_id: {
        unique: true,
        index: true,
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language',
        required: true
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    },
    tenderSources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TenderSource',
        required: true
    }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: false
    },
    bidBond: {
        type: String,
        required: false
    },
    bidOpeningDate: {
        type: Date,
        required: true
    },
    bidOpeningDateText: {
        type: String,
        required: false
    },
    bidClosingDate: {
        type: Date,
        required: true
    },
    bidClosingDateText: {
        type: String,
        required: false
    },
    publicationDate: {
        type: Date,
        required: false
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: true
    },
    isSaved: {
        type: Boolean
    },
    isFeatured: {
        type: Boolean,
        required: true,
        default: true
    },
    remark: {
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
    views: {
        type: Number,
        required: false,
        default: 0
    },
    lastUpdatedAt: {
        type: Date,
        required: false,
        default: null
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        select: false,
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        select: false,
        required: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(Date.now())
    }
})

export const TenderModel = mongoose.model<ITender>('Tender', schema)