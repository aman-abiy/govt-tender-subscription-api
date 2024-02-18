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
exports.getAdImpressions = exports.logAdImpression = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const Ad_Impressions_1 = require("../models/Ad_Impressions");
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const pagination_1 = require("../utils/pagination");
exports.logAdImpression = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let adImpressionBody;
    adImpressionBody = (0, request_body_dtos_1.adImpressionBodyCast)(req.body);
    adImpressionBody.createdAt = new Date(Date.now());
    adImpressionBody.createdBy = new mongoose_1.default.Types.ObjectId(user._id);
    let adImpression = yield Ad_Impressions_1.AdImpressionModel.create(adImpressionBody);
    if (adImpression) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: adImpression });
    }
    return next(new error_response_1.default('Could not log ad impression, please try again.', 500));
}));
exports.getAdImpressions = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { _id, type, advertisement, isActive, isDeleted, createdBy, createdAt, sort, page, limit } = req.query;
    let adImpressionQuery = {};
    adImpressionQuery.isActive = true;
    adImpressionQuery.isDeleted = false;
    if (_id) {
        adImpressionQuery._id = new mongoose_1.default.Types.ObjectId(_id.toString());
    }
    if (advertisement) {
        adImpressionQuery.advertisement = new mongoose_1.default.Types.ObjectId(advertisement.toString());
    }
    if (type) {
        adImpressionQuery.type = type.toString();
    }
    if (isActive != null) {
        adImpressionQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        adImpressionQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        adImpressionQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        adImpressionQuery.createdAt = new Date(createdAt.toString());
    }
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Ad_Impressions_1.AdImpressionModel });
    let adImpressions = yield Ad_Impressions_1.AdImpressionModel.find(adImpressionQuery).sort({ 'isFeatured': -1 })
        .populate('advertisement');
    if (adImpressions) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: adImpressions, metaData: paginationData });
    }
    return next(new error_response_1.default('No registered ad impressions found.', 404));
}));
