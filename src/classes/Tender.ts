import mongoose from 'mongoose';
import ITender from '../interfaces/Tender';

class CTender implements ITender {
    // site_id is the id from the site, just to control redundancy
    site_id: string
    title: string
    description: string
    language: mongoose.Types.ObjectId
    region: mongoose.Types.ObjectId
    categories: Array<mongoose.Types.ObjectId>
    tenderSources: Array<mongoose.Types.ObjectId>
    company?: mongoose.Types.ObjectId
    bidBond: string
    bidOpeningDate: Date
    bidOpeningDateText: string
    bidClosingDate: Date
    bidClosingDateText: string
    publicationDate: Date
    isSaved: boolean
    isPublished: boolean
    isFeatured: boolean
    isActive: boolean
    isDeleted: boolean
    views: number
    remark?: string
    lastUpdatedAt?: Date
    lastUpdatedBy?: mongoose.Types.ObjectId
    createdBy: mongoose.Types.ObjectId
    createdAt: Date

    constructor({
        site_id,
        title,
        description,
        language,
        region,
        categories,
        tenderSources,
        bidBond,
        bidOpeningDate,
        bidOpeningDateText,
        bidClosingDate,
        bidClosingDateText,
        publicationDate,
        isPublished,
        isFeatured,
        isActive,
        views,
        createdBy,
        company,
        remark,
        lastUpdatedAt,
        lastUpdatedBy,
        createdAt
    } : ITender) {
        this.site_id = site_id,
        this.title = title
        this.description = description
        this.language = language
        this.region = region
        this.categories = categories
        this.tenderSources = tenderSources
        this.company = company
        this.bidBond = bidBond
        this.bidOpeningDate = bidOpeningDate
        this.bidOpeningDateText = bidOpeningDateText
        this.bidClosingDate = bidClosingDate
        this.bidClosingDateText = bidClosingDateText
        this.publicationDate = publicationDate,
        this.isPublished = isPublished
        this.isFeatured = isFeatured
        this.isActive = isActive
        this.views = views
        this.remark = remark
        this.lastUpdatedAt = lastUpdatedAt
        this.lastUpdatedAt = lastUpdatedAt
        this.lastUpdatedBy = lastUpdatedBy
        this.createdBy = createdBy
        this.createdAt = createdAt
    }

    public static toMongooseID(value: string) : mongoose.Types.ObjectId {
        return new mongoose.Types.ObjectId(value)
    }

    public static toMongooseIDArray(value: Array<string>) : Array<mongoose.Types.ObjectId> {
        return value.map((e) => new mongoose.Types.ObjectId(e))
    }

    public castMongooseIds() {
        this.language = new mongoose.Types.ObjectId(this.language)
        this.region = new mongoose.Types.ObjectId(this.region)
        this.categories = this.categories.map((e) => new mongoose.Types.ObjectId(e))
        this.tenderSources = this.tenderSources.map((e) => new mongoose.Types.ObjectId(e))
        this.company = new mongoose.Types.ObjectId(this.company)
        this.lastUpdatedBy = new mongoose.Types.ObjectId(this.lastUpdatedBy)
        this.createdBy = new mongoose.Types.ObjectId(this.createdBy)
    }

}

export default CTender