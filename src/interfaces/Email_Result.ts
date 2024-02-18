import mongoose from 'mongoose'
import { EMAIL_TYPES } from '../utils/types/enums';

interface IEmailResult {
    _id?: mongoose.Types.ObjectId,
    account: mongoose.Types.ObjectId,
    tenders: Array<mongoose.Types.ObjectId>,
    sentToEmail: string,
    type: string,
    isSent: boolean,
    readCheckKey: number,
    isOpened?: boolean,
    openedAt?: Date,
    isDeleted?: boolean,
    createdAt?: Date
}

export default IEmailResult