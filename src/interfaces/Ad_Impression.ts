import mongoose from 'mongoose'

interface IAdImpression {
    _id: mongoose.Types.ObjectId,
    type: string,
    advertisement: mongoose.Types.ObjectId,
    isActive: boolean,
    isDeleted: boolean,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default IAdImpression