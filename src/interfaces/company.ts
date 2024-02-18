import mongoose from 'mongoose'
import Subscription from './Subscription'
import Region from './Region';
import Country from './Country';

interface ICompany {
    _id: mongoose.Types.ObjectId,
    name: Object,
    address: string,
    description: string,
    region?: mongoose.PopulatedDoc<Region>,
    country?: mongoose.PopulatedDoc<Country>
    phone1?: Object,
    phone2?: Object,
    phone3?: Object,
    tin?: string,
    email?: string,
    website?: string,
    // for corporate tender subscription plan
    lastActiveSubscription?: mongoose.PopulatedDoc<Subscription>,
    subscriptions: Array<mongoose.PopulatedDoc<Subscription>>,
    // for advertisment subscription plan
    lastActiveAdSubscription?: mongoose.PopulatedDoc<Subscription>,
    pendingAdSubscription?: mongoose.PopulatedDoc<Subscription>,
    adSubscriptions: Array<mongoose.PopulatedDoc<Subscription>>,
    hasActiveAdSubscription: boolean,
    //
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default ICompany