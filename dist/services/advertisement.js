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
exports.getAdvertisement = exports.toggleDelete = exports.toggleActiveStatus = exports.editAdvertisement = exports.addAdvertisement = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const Advertisement_Model_1 = require("../models/Advertisement_Model");
const pagination_1 = require("../utils/pagination");
exports.addAdvertisement = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let advertisementBody;
    advertisementBody = (0, request_body_dtos_1.advertisementBodyCast)(req.body);
    let oldName = req.file.originalname.replace(/\s/g, '_');
    advertisementBody.bannerImage = `${req.fileTimeStamp}_${oldName}`;
    advertisementBody.createdAt = new Date(Date.now());
    advertisementBody.createdBy = new mongoose_1.default.Types.ObjectId(user._id);
    let advertisement = yield Advertisement_Model_1.AdvertisementModel.create(advertisementBody);
    if (advertisement) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: advertisement });
    }
    return next(new error_response_1.default('Could not add advertisement, please try again.', 500));
}));
exports.editAdvertisement = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let advertisementBody;
    advertisementBody = (0, request_body_dtos_1.advertisementBodyCast)(req.body);
    advertisementBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    advertisementBody.lastUpdatedAt = new Date(Date.now());
    let advertisement = yield Advertisement_Model_1.AdvertisementModel.findById(advertisementBody._id);
    delete advertisementBody._id;
    if (advertisement) {
        advertisement = yield Advertisement_Model_1.AdvertisementModel.findByIdAndUpdate(advertisement._id, advertisementBody, {
            new: true,
            runValidators: true
        }).select({ accountName: 1 });
        if (advertisement) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: advertisement });
        }
        return next(new error_response_1.default('Could not update advertisement, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find advertisement, please try again.', 404));
}));
exports.toggleActiveStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let advertisementBody;
    advertisementBody = (0, request_body_dtos_1.advertisementBodyCast)(req.body);
    advertisementBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    advertisementBody.lastUpdatedAt = new Date(Date.now());
    let advertisement = yield Advertisement_Model_1.AdvertisementModel.findById(advertisementBody._id);
    delete advertisementBody._id;
    if (advertisement) {
        advertisement = yield Advertisement_Model_1.AdvertisementModel.findByIdAndUpdate(advertisement._id, { isActive: !advertisement.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        });
        if (advertisement) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: advertisement });
        }
        return next(new error_response_1.default('Could not update advertisement, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find advertisement, please try again.', 404));
}));
exports.toggleDelete = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let advertisementBody;
    advertisementBody = (0, request_body_dtos_1.advertisementBodyCast)(req.body);
    advertisementBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    advertisementBody.lastUpdatedAt = new Date(Date.now());
    let advertisement = yield Advertisement_Model_1.AdvertisementModel.findById(advertisementBody._id);
    delete advertisementBody._id;
    if (advertisement) {
        advertisement = yield Advertisement_Model_1.AdvertisementModel.findByIdAndUpdate(advertisement._id, { isDeleted: !advertisement.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        });
        if (advertisement) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: advertisement });
        }
        return next(new error_response_1.default('Could not toggle delete advertisement, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find advertisement, please try again.', 404));
}));
exports.getAdvertisement = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { _id, bannerTitle, bannerDescription, hyperlink, type, company, isActive, isDeleted, createdBy, createdAt, selectField, sort, page, limit } = req.query;
    let advertisementQuery = {};
    advertisementQuery.isActive = true;
    advertisementQuery.isDeleted = false;
    if (_id) {
        advertisementQuery._id = new mongoose_1.default.Types.ObjectId(_id.toString());
    }
    if (bannerTitle) {
        advertisementQuery.bannerTitle = { "$regex": bannerTitle, "$options": "i" };
    }
    if (bannerDescription) {
        advertisementQuery.bannerDescription = { "$regex": bannerDescription, "$options": "i" };
    }
    if (company) {
        advertisementQuery.company = new mongoose_1.default.Types.ObjectId(company.toString());
    }
    if (type) {
        advertisementQuery.type = type.toString();
    }
    if (isActive != null) {
        advertisementQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        advertisementQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        advertisementQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        advertisementQuery.createdAt = new Date(createdAt.toString());
    }
    if (selectField != null) {
        selectField = selectField.toString();
    }
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Advertisement_Model_1.AdvertisementModel });
    let advertisements = yield Advertisement_Model_1.AdvertisementModel.find(advertisementQuery).sort({ 'isFeatured': -1 }).select(selectField)
        .populate({
        path: 'company',
        populate: [
            {
                path: 'region',
            },
            {
                path: 'country',
            }
        ]
    });
    if (advertisements) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: advertisements, metaData: paginationData });
    }
    return next(new error_response_1.default('No registered advertisements found.', 404));
}));
