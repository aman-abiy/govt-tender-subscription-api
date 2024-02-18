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
exports.getPayment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const pagination_1 = require("../utils/pagination");
const Payment_Model_1 = require("../models/Payment_Model");
const account_permission_walls_1 = require("../utils/account_permission_walls");
exports.getPayment = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowEncoderAndEditorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let { _id, bank, paymentMethod, transactionRef, isPaid, isActive, isDeleted, createdBy, createdAt, sort, page, limit } = req.query;
    console.log('req.query P', req.query);
    let paymentQuery = {};
    paymentQuery.isDeleted = false;
    if (_id) {
        paymentQuery._id = new mongoose_1.default.Types.ObjectId(_id.toString());
    }
    if (bank) {
        paymentQuery.bank = new mongoose_1.default.Types.ObjectId(bank.toString());
    }
    if (paymentMethod) {
        paymentQuery.paymentMethod = new mongoose_1.default.Types.ObjectId(paymentMethod.toString());
    }
    if (transactionRef) {
        paymentQuery.transactionRef = transactionRef.toString();
    }
    if (isPaid != null) {
        paymentQuery.isPaid = (isPaid == 'true' ? true : false);
    }
    if (isActive != null) {
        paymentQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        paymentQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        paymentQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        paymentQuery.createdAt = new Date(createdAt.toString());
    }
    console.log('paymentQuery', paymentQuery);
    const paginationData = yield (0, pagination_1.paginationHandler)({ query: paymentQuery, queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Payment_Model_1.PaymentModel });
    let payments = yield Payment_Model_1.PaymentModel.find(paymentQuery).sort(sort)
        .populate('bank')
        .populate('paymentMethod')
        .skip(paginationData.startIndex).limit(paginationData.limit).lean();
    const total = yield Payment_Model_1.PaymentModel.aggregate([
        {
            $group: {
                _id: null,
                totalPrice: {
                    $sum: "$price"
                }
            }
        },
    ]);
    if (payments) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: { payments: payments, total: total[0].totalPrice } });
    }
    return next(new error_response_1.default('No registered payment method found.', 404));
}));
