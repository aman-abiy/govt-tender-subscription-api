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
exports.resetPassword = exports.requestPasswordReset = exports.verifyEmail = exports.requestEmailVerification = exports.logout = exports.login = exports.signup = void 0;
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const Account_Model_1 = require("../models/Account_Model");
const password_hasher_1 = require("../utils/password_hasher");
const error_response_1 = __importDefault(require("../utils/error_response"));
const encryption_1 = require("../utils/encryption");
const token_generator_1 = require("../utils/token_generator");
const email_formats_config_1 = require("../config/email_formats.config");
const email_sender_1 = require("../subscribers/email_sender");
const sms_sender_1 = require("../utils/sms_sender");
const sms_formats_config_1 = require("../config/sms_formats.config");
const functions_1 = require("../utils/functions");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const response_handler_1 = require("../utils/response_handler");
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const url_generator_1 = require("../utils/url_generator");
exports.signup = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let accountBody;
    accountBody = (0, request_body_dtos_1.accountBodyCast)(req.body);
    accountBody.createdAt = new Date(Date.now());
    accountBody.createdBy = null;
    let accounts = (yield Account_Model_1.AccountModel.find({ $or: [{ email: accountBody.email }, { mobile: accountBody.mobile }] }));
    if (accounts[0]) {
        return next(new error_response_1.default('An account with this email or mobile exists.', 409));
    }
    let account;
    accountBody.password = yield (0, password_hasher_1.hashPassword)(accountBody.password);
    account = yield Account_Model_1.AccountModel.create(accountBody);
    if (account) {
        // send welcome email with verification link
        let verificationToken = (0, token_generator_1.generateToken)();
        let verificationLink = (0, url_generator_1.generateVerificationLink)(verificationToken);
        let emailOptions = (0, email_formats_config_1.welcomeEmail)(account, verificationLink);
        yield (0, email_sender_1.sendAuthEmail)(emailOptions);
        var sessionToken = (0, encryption_1.encryptVal)(account._id.toString());
        const sessionActivity = {
            type: 'signup',
            timestamp: new Date(Date.now()),
            deviceInfo: accountBody.deviceInfo
        };
        account = yield Account_Model_1.AccountModel.findByIdAndUpdate(account._id, Object.assign({ sessionToken, $push: { sessionActivity: sessionActivity } }, (accountBody.mobileDeviceInfo != null ? { mobileDeviceInfo: accountBody.mobileDeviceInfo } : null)), {
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
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, sessionToken, data: account });
    }
    return next(new error_response_1.default('Account could not be created. Try again.', 500));
}));
exports.login = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let accountBody;
    accountBody = (0, request_body_dtos_1.accountBodyCast)(req.body);
    let accounts = (yield Account_Model_1.AccountModel.find({ $or: [{ email: accountBody.email }, { 'mobile.e164': accountBody.mobile }] }).select('+password'));
    if (accounts[0]) {
        let account = accounts[0];
        console.log(accountBody.password, account.email);
        const isMatched = yield bcryptjs_1.default.compare(accountBody.password, account.password);
        if (isMatched) {
            var sessionToken = (0, encryption_1.encryptVal)(account._id.toString());
            const sessionActivity = {
                type: 'login',
                timestamp: new Date(Date.now()),
                deviceInfo: accountBody.deviceInfo
            };
            account = yield Account_Model_1.AccountModel.findByIdAndUpdate(account._id, Object.assign({ sessionToken, $push: { sessionActivity: sessionActivity } }, (accountBody.mobileDeviceInfo != null ? { mobileDeviceInfo: accountBody.mobileDeviceInfo } : null)), {
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
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, sessionToken, data: account });
        }
        return next(new error_response_1.default('Password is incorrect.', 401));
    }
    return next(new error_response_1.default('Account not found.', 404));
}));
exports.logout = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    console.log(user);
    let accountBody;
    accountBody = (0, request_body_dtos_1.accountBodyCast)(req.body);
    const sessionActivity = {
        type: 'logout',
        timestamp: new Date(Date.now()),
        deviceInfo: accountBody.deviceInfo
    };
    let account = yield Account_Model_1.AccountModel.findByIdAndUpdate(user._id, { $push: { sessionActivity: sessionActivity } });
    if (account) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: account });
    }
    return next(new error_response_1.default('Authentication error, please try again.', 401));
}));
exports.requestEmailVerification = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let accountBody;
    accountBody = (0, request_body_dtos_1.accountBodyCast)(req.body);
    let accounts = (yield Account_Model_1.AccountModel.find({ email: accountBody.email }));
    if (accounts[0]) {
        let account = accounts[0];
        if (!account.isVerified) {
            let verificationToken = (0, token_generator_1.generateToken)();
            let verificationLink = (0, url_generator_1.generateVerificationLink)(verificationToken);
            let emailOptions = (0, email_formats_config_1.emailVerification)(account, verificationLink);
            yield (0, email_sender_1.sendAuthEmail)(emailOptions);
            const sessionActivity = {
                type: 'email-verification-request',
                timestamp: new Date(Date.now()),
                deviceInfo: accountBody.deviceInfo
            };
            account = yield Account_Model_1.AccountModel.findByIdAndUpdate(account._id, { verificationToken, $push: { sessionActivity: sessionActivity } }, {
                new: true,
                runValidators: true
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, link: verificationLink });
        }
        return next(new error_response_1.default('Your account is already verified.', 409));
    }
    return next(new error_response_1.default('Account not found.', 404));
}));
exports.verifyEmail = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { verificationToken, deviceInfo } = req.body;
    let accounts = (yield Account_Model_1.AccountModel.find({ verificationToken }));
    if (accounts[0]) {
        let account = accounts[0];
        if (!account.isVerified) {
            const sessionActivity = {
                type: 'email-verified',
                timestamp: new Date(Date.now()),
                deviceInfo
            };
            account = yield Account_Model_1.AccountModel.findByIdAndUpdate(account._id, { isVerified: true, $push: { sessionActivity: sessionActivity } }, {
                new: true,
                runValidators: true
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200 });
        }
        return next(new error_response_1.default('Your account is already verified.', 409));
    }
    return next(new error_response_1.default('Account not found, please make sure the verification link is correct.', 404));
}));
exports.requestPasswordReset = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, mobile, deviceInfo } = req.body;
    let accountBody;
    accountBody = (0, request_body_dtos_1.accountBodyCast)(req.body);
    let accounts = (yield Account_Model_1.AccountModel.find({ $or: [{ email: accountBody.email }, { mobile: accountBody.mobile }] }).select('+passwordResetToken'));
    if (accounts[0]) {
        let account = accounts[0];
        let passwordResetToken = (0, token_generator_1.generateToken)();
        let passwordResetLink = (0, url_generator_1.generatePasswordResetLink)(passwordResetToken);
        let status;
        if (email) {
            let emailOptions = (0, email_formats_config_1.passwordResetEmail)(account, passwordResetLink);
            status = yield (0, email_sender_1.sendAuthEmail)(emailOptions);
        }
        else if (mobile) {
            let smsBody = (0, sms_formats_config_1.verifyAccountSMS)(account, passwordResetLink);
            status = yield (0, sms_sender_1.sendSMS)(smsBody, account.email);
        }
        if (status) {
            const sessionActivity = {
                type: 'reset-password-request',
                timestamp: new Date(Date.now()),
                deviceInfo: accountBody.deviceInfo
            };
            // expires after 1 hour
            const passwordResetExpiryAt = (0, functions_1.extendDateTime)(new Date(Date.now()), { hours: 1, minutes: 0, seconds: 0 });
            account = yield Account_Model_1.AccountModel.findByIdAndUpdate(account._id, { passwordResetToken, passwordResetExpiryAt, $push: { sessionActivity: sessionActivity } }, {
                new: true,
                runValidators: true
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, link: passwordResetLink, data: account });
        }
        return next(new error_response_1.default('Could not send password reset link, try again.', 502));
    }
    return next(new error_response_1.default('Account not found.', 404));
}));
exports.resetPassword = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { passwordResetToken, newPassword, deviceInfo } = req.body;
    console.log(req.body);
    let accounts = yield Account_Model_1.AccountModel.find({ passwordResetToken });
    if (accounts[0]) {
        let account = accounts[0];
        if (account.passwordResetExpiryAt.getTime() >= Date.now()) {
            const sessionActivity = {
                type: 'reset-password',
                timestamp: new Date(Date.now()),
                deviceInfo: deviceInfo
            };
            newPassword = yield (0, password_hasher_1.hashPassword)(newPassword);
            account = yield Account_Model_1.AccountModel.findByIdAndUpdate(account._id, { password: newPassword, passwordResetExpiryAt: Date.now(), $push: { sessionActivity: sessionActivity } }, {
                new: true,
                runValidators: true
            });
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: account });
        }
        return next(new error_response_1.default('Password reset link has expired or been used.', 409));
    }
    return next(new error_response_1.default('Account not found, please make sure the password reset link is correct.', 404));
}));
