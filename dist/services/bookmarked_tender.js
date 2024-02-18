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
exports.getBookmarkedTender = exports.checkBookmarked = exports.toggleBookmarkedTender = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const Bookmarked_Tender_Model_1 = require("../models/Bookmarked_Tender_Model");
const pagination_1 = require("../utils/pagination");
exports.toggleBookmarkedTender = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let bookmarkedTenderBody;
    bookmarkedTenderBody = (0, request_body_dtos_1.bookmarkedTenderBodyCast)(req.body);
    bookmarkedTenderBody.lastUpdatedAt = new Date(Date.now());
    bookmarkedTenderBody.createdAt = new Date(Date.now());
    let bookmarkedTenders = yield Bookmarked_Tender_Model_1.BookmarkedTenderModel.find({ account: bookmarkedTenderBody.account, tender: bookmarkedTenderBody.tender });
    let bookmarkedTender = null;
    if (bookmarkedTenders[0] == null) {
        bookmarkedTender = yield Bookmarked_Tender_Model_1.BookmarkedTenderModel.create(bookmarkedTenderBody);
        bookmarkedTender = yield Bookmarked_Tender_Model_1.BookmarkedTenderModel.findById(bookmarkedTender._id)
            .populate({
            path: 'tender',
            populate: [
                {
                    path: 'language'
                },
                {
                    path: 'region'
                },
                {
                    path: 'tenderSources'
                },
                {
                    path: 'categories'
                }
            ],
        });
        if (bookmarkedTender) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: bookmarkedTender });
        }
        return next(new error_response_1.default('Could not save tender, please try again.', 500));
    }
    else {
        bookmarkedTender = yield Bookmarked_Tender_Model_1.BookmarkedTenderModel.findByIdAndUpdate(bookmarkedTenders[0]._id, { isRemoved: !bookmarkedTenders[0].isRemoved, lastUpdatedAt: new Date(Date.now()) }, {
            new: true,
            runValidators: true
        }).populate({
            path: 'tender',
            populate: [
                {
                    path: 'language'
                },
                {
                    path: 'region'
                },
                {
                    path: 'tenderSources'
                },
                {
                    path: 'categories'
                }
            ],
        });
        if (bookmarkedTender) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: bookmarkedTender });
        }
        return next(new error_response_1.default('Could not save tender, please try again.', 500));
    }
}));
exports.checkBookmarked = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { tender, account } = req.query;
    let bookmarkedTenderQuery = {};
    bookmarkedTenderQuery.isRemoved = false;
    bookmarkedTenderQuery.isDeleted = false;
    if (tender) {
        bookmarkedTenderQuery.tender = new mongoose_1.default.Types.ObjectId(tender.toString());
    }
    if (account) {
        bookmarkedTenderQuery.account = new mongoose_1.default.Types.ObjectId(account.toString());
    }
    let bookmarkedTenders = yield Bookmarked_Tender_Model_1.BookmarkedTenderModel.find(bookmarkedTenderQuery);
    if (bookmarkedTenders[0] == null) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: false });
    }
    else {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: true });
    }
}));
exports.getBookmarkedTender = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { _id, account, tender, isRemoved, isDeleted, lastUpdatedAt, createdAt, selectFields, sort, page, limit } = req.query;
    let bookmarkedTenderQuery = {};
    bookmarkedTenderQuery.isRemoved = false;
    bookmarkedTenderQuery.isDeleted = false;
    let selectFieldObject = null;
    let selectFieldObjectKeys = [];
    let populationObjects = [];
    if (_id) {
        bookmarkedTenderQuery._id = new mongoose_1.default.Types.ObjectId(_id.toString());
    }
    if (account) {
        bookmarkedTenderQuery.account = new mongoose_1.default.Types.ObjectId(account.toString());
    }
    if (tender) {
        bookmarkedTenderQuery.tender = new mongoose_1.default.Types.ObjectId(tender.toString());
    }
    if (isRemoved != null) {
        bookmarkedTenderQuery.isRemoved = (isRemoved == 'true' ? true : false);
    }
    if (isDeleted != null) {
        bookmarkedTenderQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (lastUpdatedAt) {
        bookmarkedTenderQuery.lastUpdatedAt = new Date(lastUpdatedAt.toString());
    }
    if (createdAt) {
        bookmarkedTenderQuery.createdAt = new Date(createdAt.toString());
    }
    if (selectFields != null) {
        selectFieldObject = JSON.parse(selectFields.toString());
        selectFieldObjectKeys = Object.keys(selectFieldObject);
    }
    console.log('selectFieldObject', selectFieldObject);
    console.log('selectFieldObjectKeys', selectFieldObjectKeys);
    if (selectFieldObjectKeys.length > 0) {
        if (!selectFieldObjectKeys.includes('language')) {
            null;
        }
        else {
            populationObjects.push({ path: 'language' });
        }
        if (!selectFieldObjectKeys.includes('region')) {
            null;
        }
        else {
            populationObjects.push({ path: 'region' });
        }
        if (!selectFieldObjectKeys.includes('tenderSources')) {
            null;
        }
        else {
            populationObjects.push({ path: 'tenderSources' });
        }
        if (!selectFieldObjectKeys.includes('categories')) {
            null;
        }
        else {
            populationObjects.push({ path: 'categories' });
        }
    }
    else {
        populationObjects.push({ path: 'language' });
        populationObjects.push({ path: 'region' });
        populationObjects.push({ path: 'tenderSources' });
        populationObjects.push({ path: 'categories' });
    }
    console.log('populationObjects', populationObjects);
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Bookmarked_Tender_Model_1.BookmarkedTenderModel });
    let bookmarkedTenders = yield Bookmarked_Tender_Model_1.BookmarkedTenderModel.find(bookmarkedTenderQuery).sort(sort)
        // .populate('account')
        .populate(Object.assign({ path: 'tender', populate: populationObjects }, (selectFieldObject != null ? { select: Object.assign({}, selectFieldObject) } : {})))
        .skip(paginationData.startIndex).limit(paginationData.limit);
    if (bookmarkedTenders) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: bookmarkedTenders, metaData: paginationData });
    }
    return next(new error_response_1.default('No saved tender found.', 404));
}));
