import mongoose from 'mongoose'

interface ILanguage {
    _id: mongoose.Types.ObjectId,
    iso: string,
    iso3: string,
    name: string,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default ILanguage