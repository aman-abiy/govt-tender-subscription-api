import mongoose from 'mongoose'
import { EMAIL_TYPES } from '../utils/types/enums';

interface IBookmarkedTender {
    _id?: mongoose.Types.ObjectId,
    account: mongoose.Types.ObjectId,
    tender: mongoose.Types.ObjectId,
    isRemoved: boolean,
    isDeleted?: boolean,
    lastUpdatedAt?: Date,
    createdAt?: Date
}

export default IBookmarkedTender