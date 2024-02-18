import mongoose from 'mongoose'

interface ICountry {
    _id: mongoose.Types.ObjectId,
    name: Object,
    slug: string,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default ICountry