"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consturctTenderModel = void 0;
const Tender_1 = __importDefault(require("../classes/Tender"));
const consturctTenderModel = (tenderJson) => {
    const tender = new Tender_1.default({
        site_id: tenderJson.id,
        title: tenderJson.title,
        description: tenderJson.description,
        language: Tender_1.default.toMongooseID(tenderJson.language.id),
        region: Tender_1.default.toMongooseID(tenderJson.region.id),
        categories: Tender_1.default.toMongooseIDArray(tenderJson.categories.map((e) => e.id)),
        tenderSources: Tender_1.default.toMongooseIDArray(tenderJson.tenderSources.map((e) => e.id)),
        bidBond: tenderJson.bidBond,
        bidOpeningDate: tenderJson.bidOpeningDate,
        bidOpeningDateText: tenderJson.bidOpeningDateText,
        bidClosingDate: tenderJson.bidClosingDate,
        bidClosingDateText: tenderJson.bidClosingDateText,
        publicationDate: tenderJson.tenderSources[0].publicationDate,
        isSaved: null,
        isPublished: tenderJson.isPublished,
        isFeatured: tenderJson.isFeatured,
        isActive: true,
        views: 0,
        isDeleted: true,
        createdBy: Tender_1.default.toMongooseID('6218c6437afaa15c03330f95'),
        createdAt: tenderJson.createdAt
    });
    // tender.castMongooseIds()
    return tender;
};
exports.consturctTenderModel = consturctTenderModel;
