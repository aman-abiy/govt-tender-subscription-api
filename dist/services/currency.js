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
exports.getCurrency = exports.toggleDelete = exports.toggleActiveStatus = exports.editCurrency = exports.addCurrency = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const Currency_Model_1 = require("../models/Currency_Model");
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const pagination_1 = require("../utils/pagination");
exports.addCurrency = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let currencyBody;
    currencyBody = (0, request_body_dtos_1.currencyBodyCast)(req.body);
    currencyBody.createdAt = new Date(Date.now());
    currencyBody.createdBy = new mongoose_1.default.Types.ObjectId(user._id);
    let currency = yield Currency_Model_1.CurrencyModel.create(currencyBody);
    if (currency) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: currency });
    }
    return next(new error_response_1.default('Could not add currency account, please try again.', 500));
}));
exports.editCurrency = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let currencyBody;
    currencyBody = (0, request_body_dtos_1.currencyBodyCast)(req.body);
    currencyBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    currencyBody.lastUpdatedAt = new Date(Date.now());
    let currency = yield Currency_Model_1.CurrencyModel.findById(currencyBody._id);
    delete currencyBody._id;
    if (currency) {
        currency = yield Currency_Model_1.CurrencyModel.findByIdAndUpdate(currency._id, currencyBody);
        if (currency) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: currency });
        }
        return next(new error_response_1.default('Could not update currency, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find currency, please try again.', 404));
}));
exports.toggleActiveStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let currencyBody;
    currencyBody = (0, request_body_dtos_1.currencyBodyCast)(req.body);
    currencyBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    currencyBody.lastUpdatedAt = new Date(Date.now());
    let currency = yield Currency_Model_1.CurrencyModel.findById(currencyBody._id);
    delete currencyBody._id;
    if (currency) {
        currency = yield Currency_Model_1.CurrencyModel.findByIdAndUpdate(currency._id, { isActive: !currency.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id });
        if (currency) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: currency });
        }
        return next(new error_response_1.default('Could not update currency, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find currency, please try again.', 404));
}));
exports.toggleDelete = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let currencyBody;
    currencyBody = (0, request_body_dtos_1.currencyBodyCast)(req.body);
    currencyBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    currencyBody.lastUpdatedAt = new Date(Date.now());
    let currency = yield Currency_Model_1.CurrencyModel.findById(currencyBody._id);
    delete currencyBody._id;
    if (currency) {
        currency = yield Currency_Model_1.CurrencyModel.findByIdAndUpdate(currency._id, { isDeleted: !currency.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id });
        if (currency) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: currency });
        }
        return next(new error_response_1.default('Could not toggle delete currency, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find currency, please try again.', 404));
}));
exports.getCurrency = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, name, iso3, isActive, isDeleted, createdBy, createdAt, sort, page, limit } = req.query;
    let currencyQuery = {};
    currencyQuery.isDeleted = false;
    if (id) {
        currencyQuery._id = new mongoose_1.default.Types.ObjectId(id.toString());
    }
    if (name) {
        currencyQuery.name = { "$regex": name, "$options": "i" };
    }
    if (iso3) {
        currencyQuery.iso3 = iso3.toString();
    }
    if (isActive != null) {
        currencyQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        currencyQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        currencyQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        currencyQuery.createdAt = new Date(createdAt.toString());
    }
    console.log('currencyQuery ', currencyQuery);
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Currency_Model_1.CurrencyModel });
    let currency = yield Currency_Model_1.CurrencyModel.find(currencyQuery);
    if (currency) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: currency, metaData: paginationData });
    }
    return next(new error_response_1.default('No registered currency found.', 404));
}));
