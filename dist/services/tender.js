"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookmarkedTender = exports.getTender = exports.viewTender = exports.toggleDelete = exports.toggleIsFeatured = exports.toggleIsPublished = exports.toggleActiveStatus = exports.bookmarkTender = exports.scrappeTenders = void 0;
const axios_1 = __importDefault(require("axios"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const tender_constructor_1 = require("../utils/tender_constructor");
const Tender_Model_1 = require("../models/Tender_Model");
const functions_1 = require("../utils/functions");
const pagination_1 = require("../utils/pagination");
const mongoose_1 = __importDefault(require("mongoose"));
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const Account_Model_1 = require("../models/Account_Model");
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const account_permission_walls_1 = require("../utils/account_permission_walls");
const scrappeTenders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let dates = (0, functions_1.getStartEndDate)();
    console.log(dates);
    let allTenders = [];
    let index = 0;
    let totalPages = 1000;
    // page count starts from 0 and ends at totalPages-1 (basically like array index)
    while (index < totalPages) {
        let result = yield axios_1.default.get(`${process.env.SCRAPPE_URL}/?startDateTime=${dates.startDate}&endDateTime=${dates.endDate}&limit=${process.env.LIMIT}&page=${index}`, {
            headers: {
                'Authorization': `Bearer ${process.env.AUTHORIZATION}`,
                'Content-Type': 'application/json'
            },
        });
        if (result.data == null) {
            return (0, response_handler_1.responseHandler)({ res: res, status: false, statusCode: 404, msg: 'No tenders found for today!' });
        }
        console.log(index);
        console.log('count ', result.data.content.length);
        // console.log('first of list ', result.data.content[0].id)
        totalPages = result.data.totalPages;
        result.data.content.forEach((tender) => {
            allTenders.push((0, tender_constructor_1.consturctTenderModel)(tender));
        });
        index++;
    }
    let tenders = yield Tender_Model_1.TenderModel.insertMany(allTenders);
    if (tenders != null) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, msg: `Added ${tenders.length} tenders to database` });
    }
});
exports.scrappeTenders = scrappeTenders;
exports.bookmarkTender = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let tenderBody;
    tenderBody = (0, request_body_dtos_1.tenderBodyCast)(req.body);
    let tender = yield Tender_Model_1.TenderModel.findById(tenderBody._id);
    if (tender) {
        let account = yield Account_Model_1.AccountModel.findOne({ _id: user._id, bookmarks: { $in: [new mongoose_1.default.Types.ObjectId(tenderBody._id)] } });
        if (account) {
            account = yield Account_Model_1.AccountModel.findByIdAndUpdate(user._id, { $pull: { bookmarks: tenderBody._id } }, {
                new: true,
                runValidators: true
            });
            // .populate<{ region: TenderSource }>('tenderSources')
            // .populate('language')
            // .populate('region')
            // .populate('categories')
        }
        else {
            account = yield Account_Model_1.AccountModel.findByIdAndUpdate(user._id, { $push: { bookmarks: tenderBody._id } }, {
                new: true,
                runValidators: true
            });
            // .populate<{ region: TenderSource }>('tenderSources')
            // .populate('language')
            // .populate('region')
            // .populate('categories')
        }
        if (account.bookmarks.includes(tender._id))
            tender.isSaved = true;
        else
            tender.isSaved = false;
        if (account) {
            console.log('DONE SUBCC');
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: tender });
        }
        return next(new error_response_1.default('Could not bookmark tender. Please try again.', 500));
    }
    return next(new error_response_1.default('Could not find tender. Please try again.', 404));
}));
exports.toggleActiveStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowEncoderAndEditorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let tenderBody;
    tenderBody = (0, request_body_dtos_1.tenderBodyCast)(req.body);
    let tender = yield Tender_Model_1.TenderModel.findById(tenderBody._id);
    tender = yield Tender_Model_1.TenderModel.findByIdAndUpdate(tenderBody._id, { isActive: !tender.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
        new: true,
        runValidators: true
    }).populate({
        path: 'createdBy',
        select: { 'fname': 1 }
    });
    if (tender) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: tender });
    }
    return next(new error_response_1.default('Could change Tender active status.', 500));
}));
exports.toggleIsPublished = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowEncoderAndEditorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let tenderBody;
    tenderBody = (0, request_body_dtos_1.tenderBodyCast)(req.body);
    let tender = yield Tender_Model_1.TenderModel.findById(tenderBody._id);
    tender = yield Tender_Model_1.TenderModel.findByIdAndUpdate(tenderBody._id, { isPublished: !tender.isPublished, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
        new: true,
        runValidators: true
    }).populate({
        path: 'createdBy',
        select: { 'fname': 1 }
    });
    if (tender) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: tender });
    }
    return next(new error_response_1.default('Could change Tender isPublished status.', 500));
}));
exports.toggleIsFeatured = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowEncoderAndEditorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let tenderBody;
    tenderBody = (0, request_body_dtos_1.tenderBodyCast)(req.body);
    let tender = yield Tender_Model_1.TenderModel.findById(tenderBody._id);
    tender = yield Tender_Model_1.TenderModel.findByIdAndUpdate(tenderBody._id, { isFeatured: !tender.isFeatured, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
        new: true,
        runValidators: true
    }).populate({
        path: 'createdBy',
        select: { 'fname': 1 }
    });
    if (tender) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: tender });
    }
    return next(new error_response_1.default('Could change Tender isFeatured status.', 500));
}));
exports.toggleDelete = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowEncoderAndEditorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let tenderBody;
    tenderBody = (0, request_body_dtos_1.tenderBodyCast)(req.body);
    let tender = yield Tender_Model_1.TenderModel.findById(tenderBody._id);
    tender = yield Tender_Model_1.TenderModel.findByIdAndUpdate(tenderBody._id, { isDeleted: !tender.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
        new: true,
        runValidators: true
    }).populate({
        path: 'createdBy',
        select: { 'fname': 1 }
    });
    if (tender) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: tender });
    }
    return next(new error_response_1.default('Could not delete Tender.', 500));
}));
exports.viewTender = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let tenderBody;
    tenderBody = (0, request_body_dtos_1.tenderBodyCast)(req.body);
    let tender = yield Tender_Model_1.TenderModel.findById(tenderBody._id);
    if (tender == null) {
        return next(new error_response_1.default('Could not find Tender.', 404));
    }
    tender = yield Tender_Model_1.TenderModel.findByIdAndUpdate(tenderBody._id, { $inc: { views: 1 } }, {
        new: true,
        runValidators: true
    }).populate('tenderSources')
        .populate('language')
        .populate('region')
        .populate('categories');
    const sessionActivity = {
        type: 'tender-view',
        tender: new mongoose_1.default.Types.ObjectId(tender._id),
        timestamp: new Date(Date.now()),
        deviceInfo: tenderBody.deviceInfo
    };
    console.log('sessionActivity', sessionActivity);
    yield Account_Model_1.AccountModel.findByIdAndUpdate(user._id, { $push: { sessionActivity: sessionActivity } });
    if (tender) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: tender });
    }
    return next(new error_response_1.default('Could not increase Tender view.', 500));
}));
exports.getTender = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let { _id, site_id, type, title, region, language, tenderSource, categories, bidOpeningDate, bidClosingDate, isPublished, isFeatured, isActive, isDeleted, createdBy, createdAt, startDate, endDate, status, selectFields, sort, page, limit } = req.query;
    let tenderQuery = {};
    tenderQuery.isDeleted = false;
    tenderQuery.isPublished = true;
    console.log('req.query T', req.query);
    if (_id) {
        tenderQuery._id = new mongoose_1.default.Types.ObjectId(_id.toString());
    }
    if (site_id) {
        tenderQuery.site_id = site_id.toString();
    }
    if (type) {
        tenderQuery.type = type.toString();
    }
    if (title) {
        tenderQuery.title = { "$regex": title, "$options": "i" };
    }
    if (region) {
        tenderQuery.region = { "$in": region.toString().split(',').map((e) => new mongoose_1.default.Types.ObjectId(e.toString())) };
    }
    if (language) {
        tenderQuery.language = { "$in": language.toString().split(',').map((e) => new mongoose_1.default.Types.ObjectId(e.toString())) };
    }
    if (tenderSource) {
        tenderQuery.tenderSources = { "$in": tenderSource.toString().split(',').map((e) => new mongoose_1.default.Types.ObjectId(e.toString())) };
    }
    if (categories) {
        tenderQuery.categories = { "$in": categories.toString().split(',').map((e) => new mongoose_1.default.Types.ObjectId(e.toString())) };
    }
    if (bidOpeningDate) {
        tenderQuery.bidOpeningDate = new Date(bidOpeningDate.toString());
    }
    if (bidClosingDate) {
        tenderQuery.bidClosingDate = new Date(bidClosingDate.toString());
    }
    if (isPublished) {
        tenderQuery.isPublished = (isPublished == 'true' ? true : false);
    }
    if (isFeatured) {
        tenderQuery.isFeatured = (isFeatured == 'true' ? true : false);
    }
    if (status) {
        if (status == 'open') {
            tenderQuery.bidClosingDate = { $gt: new Date(Date.now()).toISOString() };
        }
        else if (status == 'closed') {
            tenderQuery.bidClosingDate = { $lt: new Date(Date.now()).toISOString() };
        }
    }
    if (isActive != null) {
        tenderQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        tenderQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        tenderQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        tenderQuery.createdAt = { $date: new Date(parseInt(createdAt.toString())) };
    }
    if (startDate && endDate) {
        tenderQuery.createdAt = { $gte: new Date(parseInt(startDate.toString())).toISOString(), $lt: new Date(parseInt(endDate.toString())).toISOString() };
    }
    if (selectFields != null) {
        selectFields = JSON.parse(selectFields.toString());
    }
    if (categories && region) {
        delete tenderQuery.region;
        delete tenderQuery.categories;
        tenderQuery.$and = [
            { region: { "$in": region.toString().split(',').map((e) => new mongoose_1.default.Types.ObjectId(e.toString())) } },
            { categories: { "$in": categories.toString().split(',').map((e) => new mongoose_1.default.Types.ObjectId(e.toString())) } }
        ];
    }
    // if(tenderQuery.type == MY_TENDERS) {
    //     tenderQuery.language = { "$in": user.alertLanguages.map((e) => new mongoose.Types.ObjectId(e.toString())) }
    //     tenderQuery.region = { "$in": user.alertRegions.map((e) => new mongoose.Types.ObjectId(e.toString())) }
    //     tenderQuery.categories = { "$in": user.alertCategories.map((e) => new mongoose.Types.ObjectId(e.toString())) }
    // }
    delete tenderQuery.type;
    console.log('tenderQuery', tenderQuery);
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), query: tenderQuery, Schema: Tender_Model_1.TenderModel });
    let tenders = yield Tender_Model_1.TenderModel.find(tenderQuery).select(selectFields).sort(sort)
        .populate('tenderSources')
        .populate('language')
        .populate('region')
        .populate('categories')
        .populate({
        path: 'createdBy',
        select: { 'fname': 1 }
    })
        .populate({
        path: 'lastUpdatedBy',
        select: { 'fname': 1 }
    })
        .skip(paginationData.startIndex).limit(paginationData.limit).lean();
    tenders.forEach((e) => {
        if (user.bookmarks.includes(e._id))
            e.isSaved = true;
        else
            e.isSaved = false;
    });
    if (tenders) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: tenders, metaData: paginationData });
    }
    return next(new error_response_1.default('No Tender found.', 404));
}));
exports.getBookmarkedTender = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const account = yield Account_Model_1.AccountModel.findById(user._id).populate({
        path: 'bookmarks',
        populate: [{
                path: 'language'
            },
            {
                path: 'tenderSources'
            },
            {
                path: 'region'
            },
            {
                path: 'categories'
            },
            {
                path: 'createdBy'
            }
        ]
    });
    if (account) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: account.bookmarks });
    }
    return next(new error_response_1.default('No Bookmarked Tender found.', 404));
}));
