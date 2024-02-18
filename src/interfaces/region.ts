import mongoose from 'mongoose'

interface IRegion {
    _id: mongoose.Types.ObjectId,
    name: Object,
    slug: string,
    isActive: boolean,
    isDeleted: boolean,
    country?: mongoose.Types.ObjectId,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default IRegion