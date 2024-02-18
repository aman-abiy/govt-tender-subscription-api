import mongoose from 'mongoose'
import Category from './Category'
import Subscription from './Subscription'

interface IAccount extends mongoose.Document {
    _id: mongoose.Types.ObjectId,
    fname: string,
    lname: string,
    email?: string,
    mobile?: Object,
    password: string,
    alertCategories: Array<mongoose.PopulatedDoc<Category>>,
    alertRegions: Array<mongoose.PopulatedDoc<Category>>,
    alertLanguages: Array<mongoose.PopulatedDoc<Category>>,
    bookmarks: Array<mongoose.Types.ObjectId>,
    OTP_Code?: Number,
    company?: mongoose.Types.ObjectId,
    hasActiveSubscription: boolean,
    lastActiveSubscription?: mongoose.PopulatedDoc<Subscription>,
    pendingSubscription?: mongoose.PopulatedDoc<Subscription>,
    subscriptions: Array<mongoose.PopulatedDoc<Subscription>>,
    roles: Array<string>,
    alertStatus: boolean,
    isActive: boolean,
    isDeleted: boolean,
    isVerified: boolean,
    verificationToken?: string,
    passwordResetToken?: string,
    passwordResetExpiryAt?: Date
    sessionToken?: string,
    fcmToken?: string,
    // info of users logged in account mobile device
    mobileDeviceInfo?: Object,
    sessionActivity: Array<Object>,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default IAccount