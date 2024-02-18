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
exports.getRegion = exports.toggleDelete = exports.toggleActiveStatus = exports.editRegion = exports.addRegion = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slug_1 = __importDefault(require("slug"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const Region_Model_1 = require("../models/Region_Model");
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const pagination_1 = require("../utils/pagination");
const account_permission_walls_1 = require("../utils/account_permission_walls");
exports.addRegion = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let regionBody;
    regionBody = (0, request_body_dtos_1.regionBodyCast)(req.body);
    regionBody.slug = (0, slug_1.default)(regionBody.name.en);
    regionBody.createdAt = new Date(Date.now());
    regionBody.createdBy = user._id;
    let region = yield Region_Model_1.RegionModel.create(regionBody);
    if (region) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: region });
    }
    return next(new error_response_1.default('Could not add region.', 500));
}));
exports.editRegion = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let regionBody;
    regionBody = (0, request_body_dtos_1.regionBodyCast)(req.body);
    regionBody.slug = (0, slug_1.default)(regionBody.name.en);
    let region = yield Region_Model_1.RegionModel.findByIdAndUpdate(regionBody._id, regionBody, {
        new: true,
        runValidators: true
    });
    if (region) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: region });
    }
    return next(new error_response_1.default('Could not add region.', 500));
}));
exports.toggleActiveStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let regionBody;
    regionBody = (0, request_body_dtos_1.regionBodyCast)(req.body);
    let region = yield Region_Model_1.RegionModel.findById(regionBody._id);
    region = yield Region_Model_1.RegionModel.findByIdAndUpdate(regionBody._id, { isActive: !region.isActive }, {
        new: true,
        runValidators: true
    });
    if (region) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: region });
    }
    return next(new error_response_1.default('Could not add region.', 500));
}));
exports.toggleDelete = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let regionBody;
    regionBody = (0, request_body_dtos_1.regionBodyCast)(req.body);
    let region = yield Region_Model_1.RegionModel.findById(regionBody._id);
    region = yield Region_Model_1.RegionModel.findByIdAndUpdate(regionBody._id, { isDeleted: !region.isDeleted }, {
        new: true,
        runValidators: true
    });
    if (region) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: region });
    }
    return next(new error_response_1.default('Could not add region.', 500));
}));
exports.getRegion = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, slug, isActive, isDeleted, createdBy, createdAt, sort, page, limit } = req.query;
    let regionQuery = {};
    regionQuery.isDeleted = false;
    if (id) {
        regionQuery._id = new mongoose_1.default.Types.ObjectId(id.toString());
    }
    if (slug) {
        regionQuery.slug = { "$regex": slug, "$options": "i" };
    }
    if (isActive != null) {
        regionQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        regionQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        regionQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        regionQuery.createdAt = new Date(createdAt.toString());
    }
    console.log('regionQuery ', regionQuery);
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Region_Model_1.RegionModel });
    let region = yield Region_Model_1.RegionModel.find(regionQuery);
    if (region) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: region, metaData: paginationData });
    }
    return next(new error_response_1.default('No registered region found.', 404));
}));
