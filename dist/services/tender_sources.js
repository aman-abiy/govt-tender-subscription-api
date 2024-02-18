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
exports.getTenderSource = exports.toggleDelete = exports.toggleActiveStatus = exports.editTenderSource = exports.addTenderSources = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const Tender_Source_Model_1 = require("../models/Tender_Source_Model");
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const pagination_1 = require("../utils/pagination");
const account_permission_walls_1 = require("../utils/account_permission_walls");
exports.addTenderSources = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let tenderSourceBody;
    tenderSourceBody = (0, request_body_dtos_1.tenderSourceBodyCast)(req.body);
    tenderSourceBody.createdBy = user._id;
    tenderSourceBody.createdAt = new Date(Date.now());
    let tenderSource = yield Tender_Source_Model_1.TenderSourceModel.create(tenderSourceBody);
    if (tenderSource) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: tenderSource });
    }
    return next(new error_response_1.default('Could not add Tender Source.', 500));
}));
exports.editTenderSource = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let tenderSourceBody;
    tenderSourceBody = (0, request_body_dtos_1.tenderSourceBodyCast)(req.body);
    let tenderSource = yield Tender_Source_Model_1.TenderSourceModel.findByIdAndUpdate(tenderSourceBody._id, tenderSourceBody, {
        new: true,
        runValidators: true
    });
    if (tenderSource) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: tenderSource });
    }
    return next(new error_response_1.default('Could not add tenderSource.', 500));
}));
exports.toggleActiveStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let tenderSourceBody;
    tenderSourceBody = (0, request_body_dtos_1.tenderSourceBodyCast)(req.body);
    let tenderSource = yield Tender_Source_Model_1.TenderSourceModel.findById(tenderSourceBody._id);
    tenderSource = yield Tender_Source_Model_1.TenderSourceModel.findByIdAndUpdate(tenderSourceBody._id, { isActive: !tenderSource.isActive }, {
        new: true,
        runValidators: true
    });
    if (tenderSource) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: tenderSource });
    }
    return next(new error_response_1.default('Could change Tender Source active status.', 500));
}));
exports.toggleDelete = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let tenderSourceBody;
    tenderSourceBody = (0, request_body_dtos_1.tenderSourceBodyCast)(req.body);
    let tenderSource = yield Tender_Source_Model_1.TenderSourceModel.findById(tenderSourceBody._id);
    tenderSource = yield Tender_Source_Model_1.TenderSourceModel.findByIdAndUpdate(tenderSourceBody._id, { isDeleted: !tenderSource.isDeleted }, {
        new: true,
        runValidators: true
    });
    if (tenderSource) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: tenderSource });
    }
    return next(new error_response_1.default('Could not delete Tender Source.', 500));
}));
exports.getTenderSource = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, isActive, isDeleted, createdBy, createdAt, sort, page, limit } = req.query;
    let tenderSourceQuery = {};
    tenderSourceQuery.isDeleted = false;
    if (id) {
        tenderSourceQuery._id = new mongoose_1.default.Types.ObjectId(id.toString());
    }
    if (isActive != null) {
        tenderSourceQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        tenderSourceQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        tenderSourceQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        tenderSourceQuery.createdAt = new Date(createdAt.toString());
    }
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Tender_Source_Model_1.TenderSourceModel });
    let tenderSource = yield Tender_Source_Model_1.TenderSourceModel.find(tenderSourceQuery);
    if (tenderSource) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: tenderSource, metaData: paginationData });
    }
    return next(new error_response_1.default('No registered tenderSource found.', 404));
}));
