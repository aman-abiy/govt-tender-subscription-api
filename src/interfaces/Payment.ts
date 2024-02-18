import mongoose from 'mongoose'

interface IPayment {
    _id: mongoose.Types.ObjectId,
    price: number,
    isPaid: boolean,
    subscription: mongoose.Types.ObjectId,
    paymentMethod: mongoose.Types.ObjectId,
    currency: mongoose.Types.ObjectId,
    paymentDate: Date,
    bank?: mongoose.Types.ObjectId,
    transactionRef: string,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default IPayment