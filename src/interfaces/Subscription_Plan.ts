import mongoose from 'mongoose'

interface ISubscriptionPlan {
    _id: mongoose.Types.ObjectId,
    name: string,
    price: number,
    vat: number,
    totalPrice: number,
    // length of time in milliseconds
    duration: number,
    isUserSelectable: boolean,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default ISubscriptionPlan