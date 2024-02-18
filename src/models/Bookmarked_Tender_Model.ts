import mongoose from 'mongoose'
import IBookmarkedTender from '../interfaces/Bookmarked_Tender'

const schema = new mongoose.Schema<IBookmarkedTender>({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: false
    },
    tender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tender',
        required: false
    },
    isRemoved: {
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
        required: true,
        default: new Date(Date.now())
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(Date.now())
    }
})

export const BookmarkedTenderModel = mongoose.model<IBookmarkedTender>('BookmarkedTender', schema)
