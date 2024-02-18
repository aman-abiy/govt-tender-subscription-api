import mongoose from 'mongoose'

interface ICategory {
    _id: mongoose.Types.ObjectId,
    name: Object,
    isParent: boolean,
    hasParent: boolean,
    children: Array<mongoose.Types.ObjectId>,
    isActive: boolean,
    isDeleted: boolean,
    lastUpdatedAt?: Date,
    lastUpdatedBy?: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date
}

export default ICategory