import mongoose from 'mongoose'
import ICompanyInfo from '../interfaces/Company_Info'

const schema = new mongoose.Schema<ICompanyInfo>({
    name: {
        type: Object,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: false
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: false
    },
    phone1: {
        type: Object,
        required: false,
        default: null
    },
    phone2: {
        type: Object,
        required: false,
        default: null
    },
    phone3: {
        type: Object,
        required: false,
        default: null
    },
    tin: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    telegram: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    isDeleted: {
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
        default: new Date(Date.now())
    }
})

export const CompanyInfoModel = mongoose.model<ICompanyInfo>('CompanyInfo', schema)