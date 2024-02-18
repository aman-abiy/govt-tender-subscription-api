import mongoose from 'mongoose'

interface IAdvertisement {
    _id: mongoose.Types.ObjectId,
    bannerTitle: string,
    bannerDescription: string,
    hyperlink: string,
    bannerImage: string,
    themeColorHex: string,
    company: mongoose.Types.ObjectId,
    type: string,
    isFeatured: boolean,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default IAdvertisement