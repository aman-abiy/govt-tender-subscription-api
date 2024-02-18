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
exports.getCountry = exports.toggleDelete = exports.toggleActiveStatus = exports.editCountry = exports.addCountry = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slug_1 = __importDefault(require("slug"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const Country_Model_1 = require("../models/Country_Model");
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const pagination_1 = require("../utils/pagination");
const account_permission_walls_1 = require("../utils/account_permission_walls");
exports.addCountry = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let countryBody;
    countryBody = (0, request_body_dtos_1.countryBodyCast)(req.body);
    countryBody.slug = (0, slug_1.default)(countryBody.name.en);
    countryBody.createdAt = new Date(Date.now());
    countryBody.createdBy = user._id;
    let country = yield Country_Model_1.CountryModel.create(countryBody);
    if (country) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: country });
    }
    return next(new error_response_1.default('Could not add country.', 500));
}));
exports.editCountry = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let countryBody;
    countryBody = (0, request_body_dtos_1.countryBodyCast)(req.body);
    countryBody.slug = (0, slug_1.default)(countryBody.name.en);
    let country = yield Country_Model_1.CountryModel.findByIdAndUpdate(countryBody._id, countryBody, {
        new: true,
        runValidators: true
    });
    if (country) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: country });
    }
    return next(new error_response_1.default('Could not add country.', 500));
}));
exports.toggleActiveStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let countryBody;
    countryBody = (0, request_body_dtos_1.countryBodyCast)(req.body);
    let country = yield Country_Model_1.CountryModel.findById(countryBody._id);
    country = yield Country_Model_1.CountryModel.findByIdAndUpdate(countryBody._id, { isActive: !country.isActive }, {
        new: true,
        runValidators: true
    });
    if (country) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: country });
    }
    return next(new error_response_1.default('Could not add country.', 500));
}));
exports.toggleDelete = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let countryBody;
    countryBody = (0, request_body_dtos_1.countryBodyCast)(req.body);
    let country = yield Country_Model_1.CountryModel.findById(countryBody._id);
    country = yield Country_Model_1.CountryModel.findByIdAndUpdate(countryBody._id, { isDeleted: !country.isDeleted }, {
        new: true,
        runValidators: true
    });
    if (country) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: country });
    }
    return next(new error_response_1.default('Could not add country.', 500));
}));
exports.getCountry = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, slug, isActive, isDeleted, createdBy, createdAt, sort, page, limit } = req.query;
    let countryQuery = {};
    countryQuery.isDeleted = false;
    if (id) {
        countryQuery._id = new mongoose_1.default.Types.ObjectId(id.toString());
    }
    if (slug) {
        countryQuery.slug = { "$regex": slug, "$options": "i" };
    }
    if (isActive != null) {
        countryQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        countryQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        countryQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        countryQuery.createdAt = new Date(createdAt.toString());
    }
    console.log('countryQuery ', countryQuery);
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Country_Model_1.CountryModel });
    let country = yield Country_Model_1.CountryModel.find(countryQuery);
    if (country) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: country, metaData: paginationData });
    }
    return next(new error_response_1.default('No registered country found.', 404));
}));
