import mongoose from 'mongoose'
import ICategory from '../interfaces/Category'

const schema = new mongoose.Schema<ICategory>({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: Object,
        required: true
    },
    isParent: {
        type: Boolean,
        required: true
    },
    hasParent: {
        type: Boolean,
        required: true
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
        default: []
    }],
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

export const CategoryModel = mongoose.model<ICategory>('Category', schema)