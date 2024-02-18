import mongoose from 'mongoose'

interface IBank {
    _id: mongoose.Types.ObjectId,
    name: string,
    iso3: string,
    accountName: string,
    accountNumber: number,
    swiftCode: string,
    isActive: boolean,
    isDeleted: boolean,
    isUserViewable: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default IBank