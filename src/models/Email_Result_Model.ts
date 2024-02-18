import mongoose from 'mongoose'
import IEmailResult from '../interfaces/Email_Result'
import { EMAIL_TYPES } from '../utils/types/enums';

const schema = new mongoose.Schema<IEmailResult>({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: false
    },
    tenders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tender',
        required: false
    }],
    sentToEmail: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: EMAIL_TYPES,
        required: true
    },
    isSent: {
        type: Boolean,
        required: true,
        default: false
    },
    readCheckKey: {
        type: Number,
        required: true
    },
    isOpened: {
        type: Boolean,
        required: true,
        default: false
    },
    openedAt: {
        type: Date,
        required: false
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        // default: new Date(Date.now())
    }
})

export const EmailResultModel = mongoose.model<IEmailResult>('EmailResult', schema)
