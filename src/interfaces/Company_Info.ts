import mongoose from 'mongoose'

interface ICompanyInfo {
    _id: mongoose.Types.ObjectId,
    name: Object,
    address?: string,
    region?: mongoose.Types.ObjectId,
    country?: mongoose.Types.ObjectId
    phone1?: Object,
    phone2?: Object,
    phone3?: Object,
    tin?: number,
    email?: string,
    website?: string,
    telegram?: string,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default ICompanyInfo