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
exports.getSubscriptionPlan = exports.toggleActiveStatus = exports.editSubscriptionPlan = exports.addSubscriptionPlan = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const account_permission_walls_1 = require("../utils/account_permission_walls");
const Subscription_Plan_Model_1 = require("../models/Subscription_Plan_Model");
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const vat_calculator_1 = require("../utils/vat_calculator");
const statics_config_1 = require("../config/statics.config");
const pagination_1 = require("../utils/pagination");
exports.addSubscriptionPlan = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let subscriptionPlanBody;
    subscriptionPlanBody = (0, request_body_dtos_1.subscriptionPlanBodyCast)(req.body);
    const vatReturn = (0, vat_calculator_1.calculateVat)(subscriptionPlanBody.totalPrice, statics_config_1.VAT_PERCENTAGES);
    console.log('vatReturn', vatReturn);
    subscriptionPlanBody.vat = vatReturn.vat;
    subscriptionPlanBody.price = vatReturn.price;
    subscriptionPlanBody.createdBy = user._id;
    subscriptionPlanBody.createdAt = new Date(Date.now());
    let subscriptionPlan = yield Subscription_Plan_Model_1.SubscriptionPlanModel.create(subscriptionPlanBody);
    if (subscriptionPlan) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: subscriptionPlan });
    }
    return next(new error_response_1.default('Could not add Subscription Plan.', 500));
}));
exports.editSubscriptionPlan = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowAdminRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let subscriptionPlanBody;
    subscriptionPlanBody = (0, request_body_dtos_1.subscriptionPlanBodyCast)(req.body);
    const vatReturn = (0, vat_calculator_1.calculateVat)(subscriptionPlanBody.totalPrice, statics_config_1.VAT_PERCENTAGES);
    subscriptionPlanBody.vat = vatReturn.vat;
    subscriptionPlanBody.price = vatReturn.price;
    subscriptionPlanBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    subscriptionPlanBody.lastUpdatedAt = new Date(Date.now());
    let subscriptionPlan = yield Subscription_Plan_Model_1.SubscriptionPlanModel.findById(subscriptionPlanBody._id);
    delete subscriptionPlan._id;
    if (subscriptionPlan) {
        subscriptionPlan = yield Subscription_Plan_Model_1.SubscriptionPlanModel.findByIdAndUpdate(subscriptionPlanBody._id, subscriptionPlanBody, {
            new: true,
            runValidators: true
        });
        if (subscriptionPlan) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: subscriptionPlan });
        }
        return next(new error_response_1.default('Could not update Subscription Plan.', 500));
    }
    return next(new error_response_1.default('Could not find Subscription Plan.', 404));
}));
exports.toggleActiveStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let subscriptionPlanBody;
    subscriptionPlanBody = (0, request_body_dtos_1.subscriptionPlanBodyCast)(req.body);
    subscriptionPlanBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    subscriptionPlanBody.lastUpdatedAt = new Date(Date.now());
    let subscriptionPlan = yield Subscription_Plan_Model_1.SubscriptionPlanModel.findById(subscriptionPlanBody._id);
    delete subscriptionPlanBody._id;
    if (subscriptionPlan) {
        subscriptionPlan = yield Subscription_Plan_Model_1.SubscriptionPlanModel.findByIdAndUpdate(subscriptionPlan._id, { isActive: !subscriptionPlan.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }, {
            new: true,
            runValidators: true
        });
        if (subscriptionPlan) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: subscriptionPlan });
        }
        return next(new error_response_1.default('Could not update subscription plan, please try again.', 500));
    }
    return next(new error_response_1.default('Could not find subscription plan, please try again.', 404));
}));
exports.getSubscriptionPlan = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { _id, name, price, totalPrice, isUserSelectable, isActive, isDeleted, createdBy, createdAt, sort, page, limit } = req.query;
    let subscriptionPlanQuery = {};
    subscriptionPlanQuery.isDeleted = false;
    if (_id) {
        subscriptionPlanQuery._id = new mongoose_1.default.Types.ObjectId(_id.toString());
    }
    if (name) {
        subscriptionPlanQuery.name = name.toString();
    }
    if (price) {
        subscriptionPlanQuery.price = parseFloat(price.toString());
    }
    if (totalPrice) {
        subscriptionPlanQuery.totalPrice = parseFloat(totalPrice.toString());
    }
    if (isActive != null) {
        subscriptionPlanQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isUserSelectable != null) {
        subscriptionPlanQuery.isUserSelectable = (isUserSelectable == 'true' ? true : false);
    }
    if (isDeleted != null) {
        subscriptionPlanQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        subscriptionPlanQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        subscriptionPlanQuery.createdAt = new Date(createdAt.toString());
    }
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Subscription_Plan_Model_1.SubscriptionPlanModel });
    let subscriptionPlans = yield Subscription_Plan_Model_1.SubscriptionPlanModel.find(subscriptionPlanQuery);
    if (subscriptionPlans) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: subscriptionPlans, metaData: paginationData });
    }
    return next(new error_response_1.default('No registered Subscription Plan found.', 404));
}));
