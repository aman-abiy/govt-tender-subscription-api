import mongoose from 'mongoose'

interface ITenderSource {
    _id: mongoose.Types.ObjectId,
    name: Object
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default ITenderSource