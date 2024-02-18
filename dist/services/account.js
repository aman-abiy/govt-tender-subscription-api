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
exports.getAuthAccount = exports.getAccount = exports.toggleDelete = exports.toggleActiveStatus = exports.editOwnAccount = exports.editAccount = exports.createAccount = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const account_permission_walls_1 = require("../utils/account_permission_walls");
const error_response_1 = __importDefault(require("../utils/error_response"));
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const password_hasher_1 = require("../utils/password_hasher");
const Account_Model_1 = require("../models/Account_Model");
const encryption_1 = require("../utils/encryption");
const response_handler_1 = require("../utils/response_handler");
const pagination_1 = require("../utils/pagination");
exports.createAccount = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowSalesCoordinatorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let accountBody;
    accountBody = (0, request_body_dtos_1.accountBodyCast)(req.body);
    accountBody.createdAt = new Date(Date.now());
    accountBody.createdBy = new mongoose_1.default.Types.ObjectId(user._id);
    console.log('accountBody', accountBody);
    let accounts = yield Account_Model_1.AccountModel.find({ $or: [{ email: accountBody.email }, { mobile: accountBody.mobile }] });
    if (accounts[0]) {
        return next(new error_response_1.default('An account with this email or mobile exists.', 409));
    }
    accountBody.password = yield (0, password_hasher_1.hashPassword)(accountBody.password);
    let account = yield Account_Model_1.AccountModel.create(accountBody);
    if (account) {
        var sessionToken = (0, encryption_1.encryptVal)(account._id.toString());
        const sessionActivity = {
            type: 'agent-created-account',
            timestamp: new Date(Date.now()),
            deviceInfo: accountBody.deviceInfo
        };
        account = yield Account_Model_1.AccountModel.findByIdAndUpdate(account._id, { sessionToken, $push: { sessionActivity: sessionActivity } }, {
            new: true,
            runValidators: true
        });
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, sessionToken, data: account });
    }
    return next(new error_response_1.default('Account could not be created. Try again.', 500));
}));
exports.editAccount = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowSalesCoordinatorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let accountBody;
    accountBody = (0, request_body_dtos_1.accountBodyCast)(req.body);
    let accounts = yield Account_Model_1.AccountModel.find({ $or: [{ email: accountBody.email }, { mobile: accountBody.mobile }] });
    if ((accountBody.email != null || accountBody.mobile != null) && accounts[0] != null) {
        console.log(accountBody._id, accounts[0]._id);
        console.log(accountBody._id.equals(accounts[0]._id));
        if (!accountBody._id.equals((_a = accounts[0]) === null || _a === void 0 ? void 0 : _a._id)) {
            return next(new error_response_1.default('An account with this email or mobile exists.', 409));
        }
    }
    accountBody.password ? accountBody.password = yield (0, password_hasher_1.hashPassword)(accountBody.password) : delete accountBody.password;
    accountBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    accountBody.lastUpdatedAt = new Date(Date.now());
    let account = yield Account_Model_1.AccountModel.findByIdAndUpdate(accountBody._id, Object.assign(Object.assign({}, accountBody), { lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }), {
        new: true,
        runValidators: true
    });
    if (account) {
        if (accountBody.password) {
            var sessionToken = (0, encryption_1.encryptVal)(account._id.toString());
        }
        const sessionActivity = {
            type: 'agent-updated-account',
            timestamp: new Date(Date.now()),
            deviceInfo: accountBody.deviceInfo
        };
        account = yield Account_Model_1.AccountModel.findByIdAndUpdate(account._id, Object.assign(Object.assign({}, (accountBody.password ? { sessionToken } : {})), { $push: { sessionActivity: sessionActivity } }), {
            new: true,
            runValidators: true
        }).populate('alertRegions')
            .populate('alertCategories')
            .populate('alertCategories')
            .populate({
            path: 'bookmarks',
            populate: [
                {
                    path: 'createdBy',
                    select: { 'fname': 1 }
                }
            ]
        })
            .populate({
            path: 'lastActiveSubscription',
            populate: [{
                    path: 'subscriptionPlan'
                },
                {
                    path: 'payment'
                }
            ]
        })
            .populate({
            path: 'subscriptions',
            populate: [{
                    path: 'subscriptionPlan'
                },
                {
                    path: 'payment',
                    populate: [{
                            path: 'paymentMethod'
                        },
                        {
                            path: 'currency'
                        },
                        {
                            path: 'bank'
                        },
                        {
                            path: 'createdBy',
                            select: { 'fname': 1 }
                        }
                    ]
                },
                {
                    path: 'createdBy',
                    select: { 'fname': 1 }
                }
            ]
        })
            .populate({
            path: 'createdBy',
            select: { 'fname': 1 }
        })
            .populate({
            path: 'lastUpdatedBy',
            select: { 'fname': 1 }
        });
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, sessionToken, data: account });
    }
    return next(new error_response_1.default('Account could not be updated. Try again.', 500));
}));
exports.editOwnAccount = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    console.log('req.body', req.body);
    let accountBody;
    accountBody = (0, request_body_dtos_1.accountBodyCast)(req.body);
    delete accountBody._id;
    let accounts = yield Account_Model_1.AccountModel.find({ $or: [{ email: accountBody.email }, { mobile: accountBody.mobile }] });
    if (accounts[0]) {
        return next(new error_response_1.default('An account with this email or mobile exists. Please use a different email or mobile and try again.', 409));
    }
    accountBody.password ? accountBody.password = yield (0, password_hasher_1.hashPassword)(accountBody.password) : delete accountBody.password;
    accountBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    accountBody.lastUpdatedAt = new Date(Date.now());
    let account = yield Account_Model_1.AccountModel.findByIdAndUpdate(user._id, Object.assign(Object.assign({}, accountBody), { lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id }));
    if (account) {
        if (accountBody.password) {
            var sessionToken = (0, encryption_1.encryptVal)(account._id.toString());
        }
        const sessionActivity = {
            type: 'updated-account',
            timestamp: new Date(Date.now()),
            deviceInfo: accountBody.deviceInfo
        };
        account = yield Account_Model_1.AccountModel.findByIdAndUpdate(account._id, Object.assign(Object.assign({}, (accountBody.password ? { sessionToken } : {})), { $push: { sessionActivity: sessionActivity } }), {
            new: true,
            runValidators: true
        }).populate({
            path: 'lastActiveSubscription',
            populate: [{
                    path: 'subscriptionPlan'
                },
                {
                    path: 'payment',
                    populate: [{
                            path: 'paymentMethod'
                        },
                        {
                            path: 'currency'
                        },
                        {
                            path: 'bank'
                        }
                    ]
                }
            ]
        })
            .populate({
            path: 'pendingSubscription',
            populate: [{
                    path: 'subscriptionPlan'
                },
                {
                    path: 'payment',
                    populate: [{
                            path: 'paymentMethod'
                        },
                        {
                            path: 'currency'
                        },
                        {
                            path: 'bank'
                        }
                    ]
                }
            ]
        })
            .populate({
            path: 'subscriptions',
            populate: [{
                    path: 'subscriptionPlan'
                },
                {
                    path: 'payment',
                    populate: [{
                            path: 'paymentMethod'
                        },
                        {
                            path: 'currency'
                        },
                        {
                            path: 'bank'
                        }
                    ]
                }
            ]
        });
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: account });
    }
    return next(new error_response_1.default('Account could not be updated. Try again.', 500));
}));
exports.toggleActiveStatus = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowSalesCoordinatorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let accountBody;
    accountBody = (0, request_body_dtos_1.accountBodyCast)(req.body);
    accountBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    accountBody.lastUpdatedAt = new Date(Date.now());
    let account = yield Account_Model_1.AccountModel.findById(accountBody._id);
    if (account) {
        account = yield Account_Model_1.AccountModel.findByIdAndUpdate(accountBody._id, { isActive: !account.isActive, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id });
        if (account) {
            const sessionActivity = {
                type: 'agent-updated-account',
                timestamp: new Date(Date.now()),
                deviceInfo: accountBody.deviceInfo
            };
            account = yield Account_Model_1.AccountModel.findByIdAndUpdate(account._id, { $push: { sessionActivity: sessionActivity } }, {
                new: true,
                runValidators: true
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: account });
        }
        return next(new error_response_1.default('Account could not be deleted. Try again.', 500));
    }
    return next(new error_response_1.default('Account not found. Try again.', 404));
}));
exports.toggleDelete = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowSalesCoordinatorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let accountBody;
    accountBody = (0, request_body_dtos_1.accountBodyCast)(req.body);
    accountBody.lastUpdatedBy = new mongoose_1.default.Types.ObjectId(user._id);
    accountBody.lastUpdatedAt = new Date(Date.now());
    let account = yield Account_Model_1.AccountModel.findById(accountBody._id);
    if (account) {
        account = yield Account_Model_1.AccountModel.findByIdAndUpdate(accountBody._id, { isDeleted: !account.isDeleted, lastUpdatedAt: new Date(Date.now()), lastUpdatedBy: user._id });
        if (account) {
            const sessionActivity = {
                type: 'agent-deleted-account',
                timestamp: new Date(Date.now()),
                deviceInfo: accountBody.deviceInfo
            };
            account = yield Account_Model_1.AccountModel.findByIdAndUpdate(account._id, { $push: { sessionActivity: sessionActivity } }, {
                new: true,
                runValidators: true
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: account });
        }
        return next(new error_response_1.default('Account could not be deleted. Try again.', 500));
    }
    return next(new error_response_1.default('Account not found. Try again.', 404));
}));
exports.getAccount = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let rolePermission = (0, account_permission_walls_1.limitBelowSalesCoordinatorRoles)(user.roles);
    if (rolePermission) {
        return next(new error_response_1.default(rolePermission.msg, 500));
    }
    let { _id, fname, lname, email, mobile, company, roles, hasActiveSubscription, lastActiveSubscription, alertStatus, isActive, selectFields, isDeleted, createdBy, createdAt, sort, page, limit } = req.query;
    console.log('req.query U', req.query);
    let accountQuery = {};
    accountQuery.isDeleted = false;
    if (_id) {
        accountQuery._id = new mongoose_1.default.Types.ObjectId(_id.toString());
    }
    if (fname != null) {
        accountQuery.fname = { "$regex": fname.toString(), "$options": "i" };
    }
    if (lname != null) {
        accountQuery.lname = { "$regex": fname.toString(), "$options": "i" };
    }
    if (email != null) {
        accountQuery.email = { "$regex": email.toString(), "$options": "i" };
    }
    // if (mobile != null) {
    //     accountQuery.mobile.e164 = { 'mobile.e164': { "$regex": mobile.toString(), "$options": "i" } };
    // }
    if (company) {
        accountQuery.company = new mongoose_1.default.Types.ObjectId(company.toString());
    }
    if (roles != null) {
        accountQuery.roles = { "$in": JSON.parse(JSON.stringify(roles)) };
    }
    if (selectFields != null) {
        selectFields = JSON.parse(selectFields.toString());
        // selectFields = JSON.parse(JSON.stringify(selectFields.toString()));
    }
    if (hasActiveSubscription != null) {
        accountQuery.hasActiveSubscription = (hasActiveSubscription == 'true' ? true : false);
    }
    if (lastActiveSubscription != null) {
        accountQuery.lastActiveSubscription = JSON.parse(lastActiveSubscription.toString());
    }
    if (alertStatus != null) {
        accountQuery.alertStatus = (alertStatus == 'true' ? true : false);
    }
    if (isActive != null) {
        accountQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        accountQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        accountQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        accountQuery.createdAt = new Date(createdAt.toString());
    }
    console.log('accountQuery U', accountQuery);
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), query: accountQuery, Schema: Account_Model_1.AccountModel });
    const accounts = yield Account_Model_1.AccountModel.find(Object.assign(Object.assign({}, accountQuery), (mobile != null ? { 'mobile.e164': { "$regex": (mobile.toString()).replace('+', ''), "$options": "i" } } : {})), { sessionActivity: { $slice: -20 } }).select('+sessionActivity').select(selectFields).sort(sort)
        .populate('alertRegions')
        .populate('alertCategories')
        .populate('alertCategories')
        .populate({
        path: 'bookmarks',
        populate: [
            {
                path: 'createdBy',
                select: { 'fname': 1 }
            }
        ]
    })
        .populate({
        path: 'lastActiveSubscription',
        populate: [{
                path: 'subscriptionPlan'
            },
            {
                path: 'payment'
            }
        ]
    })
        .populate({
        path: 'subscriptions',
        populate: [{
                path: 'subscriptionPlan'
            },
            {
                path: 'payment',
                populate: [{
                        path: 'paymentMethod',
                    },
                    {
                        path: 'currency'
                    },
                    {
                        path: 'bank'
                    },
                    {
                        path: 'createdBy',
                        select: { 'fname': 1 }
                    }
                ]
            },
            {
                path: 'createdBy',
                select: { 'fname': 1 }
            }
        ]
    })
        .populate({
        path: 'createdBy',
        select: { 'fname': 1 }
    })
        .populate({
        path: 'lastUpdatedBy',
        select: { '_id': 1, 'fname': 1 }
    })
        .skip(paginationData.startIndex).limit(paginationData.limit).lean();
    if (accounts) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: accounts, metaData: paginationData });
    }
    return next(new error_response_1.default('No User found.', 404));
}));
// updates changes by constantly sending an updated state of the logged in users account
exports.getAuthAccount = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let account = yield Account_Model_1.AccountModel.findById(user._id)
        .populate({
        path: 'lastActiveSubscription',
        populate: [{
                path: 'subscriptionPlan'
            },
            {
                path: 'payment',
                populate: [{
                        path: 'paymentMethod'
                    },
                    {
                        path: 'currency'
                    },
                    {
                        path: 'bank'
                    }
                ]
            }
        ]
    })
        .populate({
        path: 'pendingSubscription',
        populate: [{
                path: 'subscriptionPlan'
            },
            {
                path: 'payment',
                populate: [{
                        path: 'paymentMethod'
                    },
                    {
                        path: 'currency'
                    },
                    {
                        path: 'bank'
                    }
                ]
            }
        ]
    })
        .populate({
        path: 'subscriptions',
        populate: [{
                path: 'subscriptionPlan'
            },
            {
                path: 'payment',
                populate: [{
                        path: 'paymentMethod'
                    },
                    {
                        path: 'currency'
                    },
                    {
                        path: 'bank'
                    }
                ]
            }
        ]
    });
    if (account) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: account });
    }
    return next(new error_response_1.default('Authentication error, please login.', 401));
}));
