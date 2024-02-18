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
exports.getPaymentMethod = exports.toggleDelete = exports.toggleActiveStatus = exports.editPaymentMethod = exports.addPaymentMethod = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const Payment_Method_Model_1 = require("../models/Payment_Method_Model");
const pagination_1 = require("../utils/pagination");
exports.addPaymentMethod = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let paymentMethodBody;
    paymentMethodBody = (0, request_body_dtos_1.paymentMethodBodyCast)(req.body);
    paymentMethodBody.createdAt = new Date(Date.now());
    paymentMethodBody.createdBy = new mongoose_1.default.Types.ObjectId(user._id);
    let paymentMethod = yield Payment_Method_Model_1.PaymentMethodModel.create(paymentMethodBody);
    if (paymentMethod) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: paymentMethod });
    }
    return next(new error_response_1.default('Could not create payment method, please try again.', 500));
}));
exports.editPaymentMethod = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let paymentMethodBody;
    paymentMethodBody = (0, request_body_dtos_1.paymentMethodBodyCast)(req.body);
    paymentMethodBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    paymentMethodBody.lastUpdatedAt = new Date(Date.now());
    let paymentMethod = yield Payment_Method_Model_1.PaymentMethodModel.findById(paymentMethodBody._id);
    delete paymentMethodBody._id;
    if (paymentMethod) {
        paymentMethod = yield Payment_Method_Model_1.PaymentMethodModel.findByIdAndUpdate(paymentMethod._id, paymentMethodBody, {
            new: true,
            runValidators: true
        });
        if (paymentMethod) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: paymentMethod });
        }
        return next(new error_response_1.default('Could not update payment method, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find payment method, please try again.', 404));
}));
exports.toggleActiveStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let paymentMethodBody;
    paymentMethodBody = (0, request_body_dtos_1.paymentMethodBodyCast)(req.body);
    paymentMethodBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    paymentMethodBody.lastUpdatedAt = new Date(Date.now());
    let paymentMethod = yield Payment_Method_Model_1.PaymentMethodModel.findById(paymentMethodBody._id);
    delete paymentMethodBody._id;
    if (paymentMethod) {
        paymentMethod = yield Payment_Method_Model_1.PaymentMethodModel.findByIdAndUpdate(paymentMethod._id, { isActive: !paymentMethod.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        });
        if (paymentMethod) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: paymentMethod });
        }
        return next(new error_response_1.default('Could not update payment method, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find payment method, please try again.', 404));
}));
exports.toggleDelete = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let paymentMethodBody;
    paymentMethodBody = (0, request_body_dtos_1.paymentMethodBodyCast)(req.body);
    paymentMethodBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    paymentMethodBody.lastUpdatedAt = new Date(Date.now());
    let paymentMethod = yield Payment_Method_Model_1.PaymentMethodModel.findById(paymentMethodBody._id);
    delete paymentMethodBody._id;
    if (paymentMethod) {
        paymentMethod = yield Payment_Method_Model_1.PaymentMethodModel.findByIdAndUpdate(paymentMethod._id, { isDeleted: !paymentMethod.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id });
        if (paymentMethod) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: paymentMethod });
        }
        return next(new error_response_1.default('Could not toggle delete payment method account, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find payment method account, please try again.', 404));
}));
exports.getPaymentMethod = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { _id, name, isActive, isDeleted, createdBy, createdAt, sort, page, limit } = req.query;
    let paymentMethodQuery = {};
    paymentMethodQuery.isDeleted = false;
    if (_id) {
        paymentMethodQuery._id = new mongoose_1.default.Types.ObjectId(_id.toString());
    }
    if (name) {
        paymentMethodQuery.name = { "$regex": name, "$options": "i" };
    }
    if (isActive != null) {
        paymentMethodQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        paymentMethodQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        paymentMethodQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        paymentMethodQuery.createdAt = new Date(createdAt.toString());
    }
    console.log('paymentMethodQuery ', paymentMethodQuery);
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Payment_Method_Model_1.PaymentMethodModel });
    let paymentMethod = yield Payment_Method_Model_1.PaymentMethodModel.find(paymentMethodQuery);
    if (paymentMethod) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: paymentMethod, metaData: paginationData });
    }
    return next(new error_response_1.default('No registered payment method found.', 404));
}));
