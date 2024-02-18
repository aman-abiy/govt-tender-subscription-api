import mongoose from 'mongoose'
import ICompany from '../interfaces/Company'

const schema = new mongoose.Schema<ICompany>({
    name: {
        type: Object,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    phone1: {
        type: Object,
        required: true,
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
        type: String,
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
    
    // for corporate tender subscription plan
    lastActiveSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false,
        default: null
    },
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false,
        default: []
    }],
    // for advertisment subscription plan
    lastActiveAdSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false,
        default: null
    },
    pendingAdSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false,
        default: null
    },
    adSubscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: false,
        default: []
    }],
    hasActiveAdSubscription: {
        type: Boolean,
        required: true,
        default: false
    },
    //
    isActive: {
        type: Boolean,
        required: true,
        default: false
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

export const CompanyModel = mongoose.model<ICompany>('Company', schema)