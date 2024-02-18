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
exports.getBankAccount = exports.toggleDelete = exports.toggleActiveStatus = exports.editBankAccount = exports.addBankAccount = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const Bank_Model_1 = require("../models/Bank_Model");
const pagination_1 = require("../utils/pagination");
exports.addBankAccount = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let bankBody;
    bankBody = (0, request_body_dtos_1.bankBodyCast)(req.body);
    bankBody.createdAt = new Date(Date.now());
    bankBody.createdBy = new mongoose_1.default.Types.ObjectId(user._id);
    let bank = yield Bank_Model_1.BankModel.create(bankBody);
    if (bank) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: bank });
    }
    return next(new error_response_1.default('Could not add bank account, please try again.', 500));
}));
exports.editBankAccount = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let bankBody;
    bankBody = (0, request_body_dtos_1.bankBodyCast)(req.body);
    bankBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    bankBody.lastUpdatedAt = new Date(Date.now());
    let bank = yield Bank_Model_1.BankModel.findById(bankBody._id);
    delete bankBody._id;
    if (bank) {
        bank = yield Bank_Model_1.BankModel.findByIdAndUpdate(bank._id, bankBody, {
            new: true,
            runValidators: true
        }).select({ accountName: 1 });
        if (bank) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: bank });
        }
        return next(new error_response_1.default('Could not update bank account, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find bank account, please try again.', 404));
}));
exports.toggleActiveStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let bankBody;
    bankBody = (0, request_body_dtos_1.bankBodyCast)(req.body);
    bankBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    bankBody.lastUpdatedAt = new Date(Date.now());
    let bank = yield Bank_Model_1.BankModel.findById(bankBody._id);
    delete bankBody._id;
    if (bank) {
        bank = yield Bank_Model_1.BankModel.findByIdAndUpdate(bank._id, { isActive: !bank.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        });
        if (bank) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: bank });
        }
        return next(new error_response_1.default('Could not update bank account, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find bank account, please try again.', 404));
}));
exports.toggleDelete = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let bankBody;
    bankBody = (0, request_body_dtos_1.bankBodyCast)(req.body);
    bankBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    bankBody.lastUpdatedAt = new Date(Date.now());
    let bank = yield Bank_Model_1.BankModel.findById(bankBody._id);
    delete bankBody._id;
    if (bank) {
        bank = yield Bank_Model_1.BankModel.findByIdAndUpdate(bank._id, { isDeleted: !bank.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        });
        if (bank) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: bank });
        }
        return next(new error_response_1.default('Could not toggle delete bank account, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find bank account, please try again.', 404));
}));
exports.getBankAccount = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { _id, name, accountName, accountNumber, swiftCode, isActive, isDeleted, isUserViewable, createdBy, createdAt, selectField, sort, page, limit } = req.query;
    let bankQuery = {};
    bankQuery.isDeleted = false;
    if (_id) {
        bankQuery._id = new mongoose_1.default.Types.ObjectId(_id.toString());
    }
    if (name) {
        bankQuery.name = { "$regex": name, "$options": "i" };
    }
    if (accountName) {
        bankQuery.accountName = { "$regex": accountName, "$options": "i" };
    }
    if (accountNumber) {
        bankQuery.accountNumber = parseInt(accountNumber.toString());
    }
    if (swiftCode) {
        bankQuery.swiftCode = swiftCode.toString();
    }
    if (isActive != null) {
        bankQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        bankQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (isUserViewable != null) {
        bankQuery.isUserViewable = (isUserViewable == 'true' ? true : false);
    }
    if (createdBy) {
        bankQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        bankQuery.createdAt = new Date(createdAt.toString());
    }
    if (selectField != null) {
        selectField = selectField.toString();
    }
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Bank_Model_1.BankModel });
    let banks = yield Bank_Model_1.BankModel.find(bankQuery).select(selectField);
    if (banks) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: banks, metaData: paginationData });
    }
    return next(new error_response_1.default('No registered bank accounts found.', 404));
}));
