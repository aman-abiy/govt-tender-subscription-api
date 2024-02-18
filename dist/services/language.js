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
exports.getLanguage = exports.toggleDelete = exports.toggleActiveStatus = exports.editLanguage = exports.addLanguage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const Language_Model_1 = require("../models/Language_Model");
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const pagination_1 = require("../utils/pagination");
const account_permission_walls_1 = require("../utils/account_permission_walls");
exports.addLanguage = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let languageBody;
    languageBody = (0, request_body_dtos_1.languageBodyCast)(req.body);
    languageBody.createdAt = new Date(Date.now());
    languageBody.createdBy = user._id;
    let language = yield Language_Model_1.LanguageModel.create(languageBody);
    if (language) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: language });
    }
    return next(new error_response_1.default('Could not add language.', 500));
}));
exports.editLanguage = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let languageBody;
    languageBody = (0, request_body_dtos_1.languageBodyCast)(req.body);
    let language = yield Language_Model_1.LanguageModel.findByIdAndUpdate(languageBody._id, languageBody, {
        new: true,
        runValidators: true
    });
    if (language) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: language });
    }
    return next(new error_response_1.default('Could not add language.', 500));
}));
exports.toggleActiveStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let languageBody;
    languageBody = (0, request_body_dtos_1.languageBodyCast)(req.body);
    let language = yield Language_Model_1.LanguageModel.findById(languageBody._id);
    language = yield Language_Model_1.LanguageModel.findByIdAndUpdate(languageBody._id, { isActive: !language.isActive }, {
        new: true,
        runValidators: true
    });
    if (language) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: language });
    }
    return next(new error_response_1.default('Could not add language.', 500));
}));
exports.toggleDelete = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let languageBody;
    languageBody = (0, request_body_dtos_1.languageBodyCast)(req.body);
    let language = yield Language_Model_1.LanguageModel.findById(languageBody._id);
    language = yield Language_Model_1.LanguageModel.findByIdAndUpdate(languageBody._id, { isDeleted: !language.isDeleted }, {
        new: true,
        runValidators: true
    });
    if (language) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: language });
    }
    return next(new error_response_1.default('Could not add language.', 500));
}));
exports.getLanguage = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, iso, iso3, name, isActive, isDeleted, createdBy, createdAt, sort, page, limit } = req.query;
    let languageQuery = {};
    languageQuery.isDeleted = false;
    if (id) {
        languageQuery._id = new mongoose_1.default.Types.ObjectId(id.toString());
    }
    if (iso) {
        languageQuery.iso = iso.toString();
    }
    if (iso3) {
        languageQuery.iso3 = iso3.toString();
    }
    if (name) {
        languageQuery.name = name.toString();
    }
    if (isActive != null) {
        languageQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        languageQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        languageQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        languageQuery.createdAt = new Date(createdAt.toString());
    }
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Language_Model_1.LanguageModel });
    let language = yield Language_Model_1.LanguageModel.find(languageQuery);
    if (language) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: language, metaData: paginationData });
    }
    return next(new error_response_1.default('No registered language found.', 404));
}));
