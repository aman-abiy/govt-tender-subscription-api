"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class CTender {
    constructor({ site_id, title, description, language, region, categories, tenderSources, bidBond, bidOpeningDate, bidOpeningDateText, bidClosingDate, bidClosingDateText, publicationDate, isPublished, isFeatured, isActive, views, createdBy, company, remark, lastUpdatedAt, lastUpdatedBy, createdAt }) {
        this.site_id = site_id,
            this.title = title;
        this.description = description;
        this.language = language;
        this.region = region;
        this.categories = categories;
        this.tenderSources = tenderSources;
        this.company = company;
        this.bidBond = bidBond;
        this.bidOpeningDate = bidOpeningDate;
        this.bidOpeningDateText = bidOpeningDateText;
        this.bidClosingDate = bidClosingDate;
        this.bidClosingDateText = bidClosingDateText;
        this.publicationDate = publicationDate,
            this.isPublished = isPublished;
        this.isFeatured = isFeatured;
        this.isActive = isActive;
        this.views = views;
        this.remark = remark;
        this.lastUpdatedAt = lastUpdatedAt;
        this.lastUpdatedAt = lastUpdatedAt;
        this.lastUpdatedBy = lastUpdatedBy;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }
    static toMongooseID(value) {
        return new mongoose_1.default.Types.ObjectId(value);
    }
    static toMongooseIDArray(value) {
        return value.map((e) => new mongoose_1.default.Types.ObjectId(e));
    }
    castMongooseIds() {
        this.language = new mongoose_1.default.Types.ObjectId(this.language);
        this.region = new mongoose_1.default.Types.ObjectId(this.region);
        this.categories = this.categories.map((e) => new mongoose_1.default.Types.ObjectId(e));
        this.tenderSources = this.tenderSources.map((e) => new mongoose_1.default.Types.ObjectId(e));
        this.company = new mongoose_1.default.Types.ObjectId(this.company);
        this.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(this.lastUpdatedBy);
        this.createdBy = new mongoose_1.default.Types.ObjectId(this.createdBy);
    }
}
exports.default = CTender;
