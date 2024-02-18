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
exports.handleExpiredAndPendingSubscriptions = exports.getSubscription = exports.deleteSubscription = exports.editSubscription = exports.addPendingSubscription = exports.addSubscription = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const subscription_duration_calc_1 = require("../utils/subscription_duration_calc");
const Payment_Model_1 = require("../models/Payment_Model");
const Subscription_Model_1 = require("../models/Subscription_Model");
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const invoice_generator_1 = require("../utils/invoice_generator");
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const pagination_1 = require("../utils/pagination");
const Account_Model_1 = require("../models/Account_Model");
const Subscription_Plan_Model_1 = require("../models/Subscription_Plan_Model");
const account_permission_walls_1 = require("../utils/account_permission_walls");
exports.addSubscription = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowSalesCoordinatorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let subscriptionBody;
    subscriptionBody = (0, request_body_dtos_1.subscriptionBodyCast)(req.body);
    let subscriptionAccount = yield Account_Model_1.AccountModel.findById(subscriptionBody.account);
    if (!subscriptionAccount.hasActiveSubscription) {
        let subscriptionPlan = yield Subscription_Plan_Model_1.SubscriptionPlanModel.findById(subscriptionBody.subscriptionPlan);
        let subscriptionDates = (0, subscription_duration_calc_1.calculateSubscriptionEndDate)(subscriptionPlan, subscriptionBody.startDate);
        subscriptionBody.startDate = subscriptionDates.startDate;
        subscriptionBody.endDate = subscriptionDates.endDate;
        let paymentObject = {
            isPaid: subscriptionBody.isPaid,
            price: subscriptionPlan.totalPrice,
            paymentMethod: subscriptionBody.paymentMethod,
            bank: subscriptionBody.bank,
            currency: subscriptionBody.currency,
            paymentDate: subscriptionBody.paymentDate,
            transactionRef: subscriptionBody.transactionRef,
            createdAt: new Date(Date.now()),
            createdBy: user._id
        };
        let invoiceObj = yield (0, invoice_generator_1.generateInvoice)(subscriptionPlan, subscriptionBody.paymentDate);
        delete subscriptionBody.isPaid;
        delete subscriptionBody.paymentMethod;
        delete subscriptionBody.currency;
        delete subscriptionBody.transactionRef;
        // delete this or will default _id to null
        delete subscriptionBody._id;
        subscriptionBody.createdAt = new Date(Date.now());
        subscriptionBody.createdBy = user._id;
        let payment = yield Payment_Model_1.PaymentModel.create(paymentObject);
        if (payment) {
            subscriptionBody.payment = payment._id;
            subscriptionBody.invoiceId = invoiceObj.invoiceId;
            subscriptionBody.invoicePDF = invoiceObj.fileName;
            let subscription = yield Subscription_Model_1.SubscriptionModel.create(subscriptionBody);
            console.log('subscription._id ', subscription);
            if (subscription) {
                payment = yield Payment_Model_1.PaymentModel.findByIdAndUpdate(payment._id, { subscription: subscription._id });
                yield Account_Model_1.AccountModel.findByIdAndUpdate(subscriptionBody.account, { lastActiveSubscription: subscription._id, hasActiveSubscription: true, $push: { subscriptions: subscription._id } });
                return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: subscription });
            }
            yield Payment_Model_1.PaymentModel.findByIdAndDelete(payment._id);
            return next(new error_response_1.default('Could not create Subscription.', 500));
        }
        return next(new error_response_1.default('Could not register Payment details.', 500));
    }
    return next(new error_response_1.default('There is already an active subscription for this account.', 409));
}));
exports.addPendingSubscription = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowSalesCoordinatorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let subscriptionBody;
    subscriptionBody = (0, request_body_dtos_1.subscriptionBodyCast)(req.body);
    let subscriptionAccount = yield Account_Model_1.AccountModel.findById(subscriptionBody.account).populate('lastActiveSubscription');
    // only add pending subscription if account has an active subscription
    if (subscriptionAccount.hasActiveSubscription) {
        let startDate = subscriptionAccount.lastActiveSubscription.endDate;
        let subscriptionPlan = yield Subscription_Plan_Model_1.SubscriptionPlanModel.findById(subscriptionBody.subscriptionPlan);
        let subscriptionDates = (0, subscription_duration_calc_1.calculateSubscriptionEndDate)(subscriptionPlan, startDate);
        subscriptionBody.startDate = subscriptionDates.startDate;
        subscriptionBody.endDate = subscriptionDates.endDate;
        let paymentObject = {
            isPaid: subscriptionBody.isPaid,
            price: subscriptionPlan.totalPrice,
            paymentMethod: subscriptionBody.paymentMethod,
            bank: subscriptionBody.bank,
            currency: subscriptionBody.currency,
            paymentDate: subscriptionBody.paymentDate,
            transactionRef: subscriptionBody.transactionRef,
            createdAt: new Date(Date.now()),
            createdBy: user._id
        };
        let invoiceObj = yield (0, invoice_generator_1.generateInvoice)(subscriptionPlan, subscriptionBody.paymentDate);
        delete subscriptionBody.isPaid;
        delete subscriptionBody.paymentMethod;
        delete subscriptionBody.currency;
        delete subscriptionBody.paymentDate;
        delete subscriptionBody.transactionRef;
        subscriptionBody.isPending = true;
        subscriptionBody.isActive = false;
        subscriptionBody.createdAt = new Date(Date.now());
        subscriptionBody.createdBy = user._id;
        let payment = yield Payment_Model_1.PaymentModel.create(paymentObject);
        if (payment) {
            subscriptionBody.payment = payment._id;
            subscriptionBody.invoiceId = invoiceObj.invoiceId;
            subscriptionBody.invoicePDF = invoiceObj.fileName;
            let subscription = yield Subscription_Model_1.SubscriptionModel.create(subscriptionBody);
            console.log('subscription._id', subscription);
            if (subscription) {
                payment = yield Payment_Model_1.PaymentModel.findByIdAndUpdate(payment._id, { subscription: subscription._id });
                yield Account_Model_1.AccountModel.findByIdAndUpdate(subscriptionBody.account, { pendingSubscription: subscription._id, $push: { subscriptions: subscription._id } });
                return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: subscription });
            }
            return next(new error_response_1.default('Could not create Subscription.', 500));
        }
        return next(new error_response_1.default('Could not register Payment details.', 500));
    }
    return next(new error_response_1.default('There is no active subscription for this account, add a subscription before a pending subscription.', 409));
}));
exports.editSubscription = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowSalesCoordinatorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let subscriptionBody;
    subscriptionBody = (0, request_body_dtos_1.subscriptionBodyCast)(req.body);
    let subscriptionPlan = yield Subscription_Plan_Model_1.SubscriptionPlanModel.findById(subscriptionBody.subscriptionPlan);
    let subscription = yield Subscription_Model_1.SubscriptionModel.findById(subscriptionBody._id);
    // doesn't work properly
    if (subscriptionBody.startDate.getTime() !== subscription.startDate.getTime()) {
        let subscriptionDates = (0, subscription_duration_calc_1.calculateSubscriptionEndDate)(subscriptionPlan, subscriptionBody.startDate);
        subscriptionBody.startDate = subscriptionDates.startDate;
        subscriptionBody.endDate = subscriptionDates.endDate;
    }
    // .populate<{ payment: Payment }>('payment')
    // let paymentObject = (subscription.payment as Payment | null)
    let paymentObject = {
        isPaid: subscriptionBody.isPaid,
        price: subscriptionPlan.totalPrice,
        paymentMethod: subscriptionBody.paymentMethod,
        bank: subscriptionBody.bank,
        currency: subscriptionBody.currency,
        paymentDate: subscriptionBody.paymentDate,
        transactionRef: subscriptionBody.transactionRef
    };
    let invoiceObj = yield (0, invoice_generator_1.generateInvoice)(subscriptionPlan, subscriptionBody.paymentDate);
    delete subscriptionBody.isPaid;
    delete subscriptionBody.paymentMethod;
    delete subscriptionBody.currency;
    delete subscriptionBody.paymentDate;
    delete subscriptionBody.transactionRef;
    subscriptionBody.lastUpdatedBy = user._id;
    let payment = yield Payment_Model_1.PaymentModel.findByIdAndUpdate(subscription.payment, paymentObject);
    if (payment) {
        subscriptionBody.payment = payment._id;
        subscriptionBody.invoiceId = invoiceObj.invoiceId;
        subscriptionBody.invoicePDF = invoiceObj.fileName;
        subscription = yield Subscription_Model_1.SubscriptionModel.findByIdAndUpdate(subscription._id, subscriptionBody, {
            new: true,
            runValidators: true
        });
        if (subscription) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: subscription });
        }
        return next(new error_response_1.default('Could not update Subscription.', 500));
    }
    return next(new error_response_1.default('Could not update Payment details.', 500));
}));
exports.deleteSubscription = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowSalesCoordinatorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let subscriptionBody;
    subscriptionBody = (0, request_body_dtos_1.subscriptionBodyCast)(req.body);
    let subscription = yield Subscription_Model_1.SubscriptionModel.findById(subscriptionBody._id);
    if (subscription) {
        subscription = yield Subscription_Model_1.SubscriptionModel.findByIdAndUpdate(subscriptionBody._id, { isDeleted: true }, {
            new: true,
            runValidators: true
        });
        yield Payment_Model_1.PaymentModel.findByIdAndUpdate(subscription.payment, { isDeleted: true });
        if (subscription) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: subscription });
        }
        return next(new error_response_1.default('Could not delete Subscription, please try again.', 500));
    }
    return next(new error_response_1.default('Subscription could not be found.', 404));
}));
exports.getSubscription = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowSalesCoordinatorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let { _id, account, subscriptionPlan, startDate, endDate, isActive, isDeleted, createdBy, createdAt, sort, page, limit } = req.query;
    let subscriptionQuery = {};
    subscriptionQuery.isDeleted = false;
    if (_id) {
        subscriptionQuery._id = new mongoose_1.default.Types.ObjectId(_id.toString());
    }
    if (account) {
        subscriptionQuery.account = new mongoose_1.default.Types.ObjectId(account.toString());
    }
    if (startDate) {
        subscriptionQuery.startDate = new Date(startDate.toString());
    }
    if (endDate) {
        subscriptionQuery.endDate = new Date(endDate.toString());
    }
    if (subscriptionPlan) {
        subscriptionQuery.subscriptionPlan = new mongoose_1.default.Types.ObjectId(subscriptionPlan.toString());
    }
    if (isActive) {
        subscriptionQuery.isActive;
    }
    if (isDeleted) {
        subscriptionQuery.isDeleted;
    }
    if (createdBy) {
        subscriptionQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        subscriptionQuery.createdAt = new Date(createdAt.toString());
    }
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), query: subscriptionQuery, Schema: Subscription_Model_1.SubscriptionModel });
    let subscription = yield Subscription_Model_1.SubscriptionModel.find(subscriptionQuery).sort(sort)
        .populate('account')
        .populate('subscriptionPlan')
        .populate({
        path: 'payment',
        populate: [{
                path: 'paymentMethod'
            },
            {
                path: 'bank'
            },
            {
                path: 'currency'
            }
        ]
    }).skip(paginationData.startIndex).limit(paginationData.limit).lean();
    if (subscription[0]) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: subscription, metaData: paginationData });
    }
    return next(new error_response_1.default('No Subscription found.', 404));
}));
// closes expired subscriptions and opens if any pending subscription exists
exports.handleExpiredAndPendingSubscriptions = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // select subscription with endDate equal to a day before today
    let date = new Date(Date.now());
    date.setUTCHours(0, 0, 1, 0);
    console.log('date 1', date);
    date.setDate(date.getDate() + 1);
    console.log('date 2', date);
    let subscriptions = yield Subscription_Model_1.SubscriptionModel.find({ endDate: { $lte: date }, isActive: true }).populate('account');
    console.log('subscriptions', subscriptions, date.getMilliseconds());
    if (subscriptions[0]) {
        subscriptions.forEach((e) => __awaiter(void 0, void 0, void 0, function* () {
            let account = e.account;
            if (account.pendingSubscription) {
                yield Promise.all([
                    // set the accounts pending subscription as the active subscription
                    yield Account_Model_1.AccountModel.findByIdAndUpdate(account._id, { lastActiveSubscription: account.pendingSubscription, pendingSubscription: null, hasActiveSubscription: true }),
                    // disable the expired subscription
                    yield Subscription_Model_1.SubscriptionModel.findByIdAndUpdate(account.lastActiveSubscription, { isActive: false, }),
                    // set the pending subscription as active
                    yield Subscription_Model_1.SubscriptionModel.findByIdAndUpdate(account.pendingSubscription, { isPending: false, isActive: true, })
                ]);
            }
            else {
                yield Promise.all([
                    // set the account as having no active subscription and kill session
                    yield Account_Model_1.AccountModel.findByIdAndUpdate(account._id, { hasActiveSubscription: false, pendingSubscription: null }),
                    // disable the expired subscription
                    yield Subscription_Model_1.SubscriptionModel.findByIdAndUpdate(account.lastActiveSubscription, { isActive: false, })
                ]);
            }
        }));
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, msg: `Closed ${subscriptions.length} subscriptions.` });
    }
    return next(new error_response_1.default('No Subscription expiring today found.', 404));
}));
