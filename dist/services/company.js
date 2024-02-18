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
exports.getCompany = exports.toggleDelete = exports.toggleActiveStatus = exports.editCompany = exports.addCompany = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const Company_Model_1 = require("../models/Company_Model");
const pagination_1 = require("../utils/pagination");
exports.addCompany = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let companyBody;
    companyBody = (0, request_body_dtos_1.companyBodyCast)(req.body);
    companyBody.createdAt = new Date(Date.now());
    companyBody.createdBy = new mongoose_1.default.Types.ObjectId(user._id);
    let company = yield Company_Model_1.CompanyModel.create(companyBody);
    if (company) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: company });
    }
    return next(new error_response_1.default('Could not add company account, please try again.', 500));
}));
exports.editCompany = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let companyBody;
    companyBody = (0, request_body_dtos_1.companyBodyCast)(req.body);
    companyBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    companyBody.lastUpdatedAt = new Date(Date.now());
    let company = yield Company_Model_1.CompanyModel.findById(companyBody._id);
    delete companyBody._id;
    if (company) {
        company = yield Company_Model_1.CompanyModel.findByIdAndUpdate(company._id, companyBody, {
            new: true,
            runValidators: true
        }).select({ accountName: 1 });
        if (company) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: company });
        }
        return next(new error_response_1.default('Could not update company account, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find company account, please try again.', 404));
}));
exports.toggleActiveStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let companyBody;
    companyBody = (0, request_body_dtos_1.companyBodyCast)(req.body);
    companyBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    companyBody.lastUpdatedAt = new Date(Date.now());
    let company = yield Company_Model_1.CompanyModel.findById(companyBody._id);
    delete companyBody._id;
    if (company) {
        company = yield Company_Model_1.CompanyModel.findByIdAndUpdate(company._id, { isActive: !company.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        });
        if (company) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: company });
        }
        return next(new error_response_1.default('Could not update company account, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find company account, please try again.', 404));
}));
exports.toggleDelete = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let companyBody;
    companyBody = (0, request_body_dtos_1.companyBodyCast)(req.body);
    companyBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    companyBody.lastUpdatedAt = new Date(Date.now());
    let company = yield Company_Model_1.CompanyModel.findById(companyBody._id);
    delete companyBody._id;
    if (company) {
        company = yield Company_Model_1.CompanyModel.findByIdAndUpdate(company._id, { isDeleted: !company.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        });
        if (company) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: company });
        }
        return next(new error_response_1.default('Could not toggle delete company account, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find company account, please try again.', 404));
}));
exports.getCompany = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { _id, name, address, region, country, phone1, tin, email, isActive, isDeleted, sort, page, limit, createdAt, createdBy, selectField } = req.query;
    let companyQuery = {};
    companyQuery.isDeleted = false;
    if (_id) {
        companyQuery._id = new mongoose_1.default.Types.ObjectId(_id.toString());
    }
    if (name) {
        companyQuery.name = { "$regex": name, "$options": "i" };
    }
    if (address) {
        companyQuery.address = { "$regex": address, "$options": "i" };
    }
    if (region) {
        companyQuery.region = new mongoose_1.default.Types.ObjectId(region.toString());
    }
    if (country) {
        companyQuery.country = new mongoose_1.default.Types.ObjectId(country.toString());
    }
    if (tin) {
        companyQuery.tin = { "$regex": tin, "$options": "i" };
    }
    if (email) {
        companyQuery.email = { "$regex": email, "$options": "i" };
    }
    if (isActive != null) {
        companyQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        companyQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        companyQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        companyQuery.createdAt = new Date(createdAt.toString());
    }
    if (selectField != null) {
        selectField = selectField.toString();
    }
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Company_Model_1.CompanyModel });
    let companys = yield Company_Model_1.CompanyModel.find(Object.assign(Object.assign({}, companyQuery), (phone1 != null ? { 'mobile.e164': { "$regex": (phone1.toString()).replace('+', ''), "$options": "i" } } : {}))).select(selectField);
    if (companys) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: companys, metaData: paginationData });
    }
    return next(new error_response_1.default('No registered company accounts found.', 404));
}));
