import mongoose from 'mongoose'

interface IPaymentMethod {
    _id: mongoose.Types.ObjectId,
    name: String,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default IPaymentMethod