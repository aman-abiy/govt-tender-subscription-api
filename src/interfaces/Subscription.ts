import mongoose from 'mongoose'
import Account from './Account'
import Payment from './Payment'

interface ISubscription {
    _id: mongoose.Types.ObjectId,
    account: mongoose.PopulatedDoc<Account>,
    subscriptionPlan: mongoose.Types.ObjectId,
    payment: mongoose.PopulatedDoc<Payment>,
    invoiceId: number,
    invoicePDF: string,
    startDate: Date,
    endDate: Date,
    isPending: boolean,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default ISubscription