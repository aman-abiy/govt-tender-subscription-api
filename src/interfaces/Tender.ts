import mongoose from 'mongoose'
import Language from './Language'
import Region from './Region';

interface ITender {
    _id?: mongoose.Types.ObjectId,
    // site_id is the id from the site, just to control redundancy
    site_id: string,
    title: string
    description: string,
    language: mongoose.Types.ObjectId,
    region: mongoose.Types.ObjectId,
    categories: Array<mongoose.Types.ObjectId>,
    tenderSources: Array<mongoose.Types.ObjectId>,
    company?: mongoose.Types.ObjectId,
    bidBond: string,
    bidOpeningDate: Date,
    bidOpeningDateText: string,
    bidClosingDate: Date,
    bidClosingDateText: string,
    publicationDate: Date,
    isSaved: boolean,
    isPublished: boolean,
    isFeatured: boolean,
    isActive: boolean,
    isDeleted: boolean,
    views: number,
    remark?: string,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default ITender