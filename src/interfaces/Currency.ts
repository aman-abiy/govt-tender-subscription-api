import mongoose from 'mongoose'

interface ICurrency {
    _id: mongoose.Types.ObjectId,
    name: string,
    iso3: string,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default ICurrency