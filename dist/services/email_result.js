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
exports.openEmail = exports.getEmailResult = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const pagination_1 = require("../utils/pagination");
const Email_Result_Model_1 = require("../models/Email_Result_Model");
exports.getEmailResult = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { _id, account, type, isSent, isOpened, isDeleted, createdAt, select, sort, page, limit } = req.query;
    let emailResultQuery = {};
    emailResultQuery.isDeleted = false;
    if (_id) {
        emailResultQuery._id = new mongoose_1.default.Types.ObjectId(_id.toString());
    }
    if (account) {
        emailResultQuery.account = new mongoose_1.default.Types.ObjectId(account.toString());
    }
    if (type != null) {
        emailResultQuery.type = type.toString();
    }
    if (isSent != null) {
        emailResultQuery.isSent = (isSent == 'true' ? true : false);
    }
    if (isOpened != null) {
        emailResultQuery.isOpened = (isOpened == 'true' ? true : false);
    }
    if (isDeleted != null) {
        emailResultQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdAt) {
        emailResultQuery.createdAt = new Date(createdAt.toString());
    }
    if (select != null) {
        select = JSON.parse(select.toString());
    }
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), query: emailResultQuery, Schema: Email_Result_Model_1.EmailResultModel });
    let emailResults;
    if (_id != null) {
        emailResults = yield Email_Result_Model_1.EmailResultModel.find(emailResultQuery)
            .populate(Object.assign({ path: 'tenders', populate: [{
                    path: 'language'
                },
                {
                    path: 'region'
                },
                {
                    path: 'tenderSources'
                },
                {
                    path: 'categories'
                }
            ] }, (select != null ? { select: select } : {}))).skip(paginationData.startIndex).limit(paginationData.limit).lean().sort(sort);
    }
    else {
        emailResults = yield Email_Result_Model_1.EmailResultModel.find(emailResultQuery)
            .skip(paginationData.startIndex).limit(paginationData.limit).lean().sort(sort);
    }
    if (emailResults) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: emailResults, metaData: paginationData });
    }
    return next(new error_response_1.default('No sent emails found.', 404));
}));
exports.openEmail = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { readCheckKey } = req.query;
    let emailResultQuery = {};
    if (readCheckKey) {
        emailResultQuery.readCheckKey = parseInt(readCheckKey.toString());
    }
    let emailResult = yield Email_Result_Model_1.EmailResultModel.findOne({ readCheckKey: emailResultQuery.readCheckKey });
    if (emailResult) {
        if (!emailResult.isOpened) {
            emailResult = yield Email_Result_Model_1.EmailResultModel.findByIdAndUpdate(emailResult._id, { isOpened: true, openedAt: new Date(Date.now()) }, {
                new: true,
                runValidators: true
            });
            if (emailResult) {
                return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: emailResult });
            }
            return next(new error_response_1.default('Could not set Alert Email as opened, please try again.', 500));
        }
        return next(new error_response_1.default('Email has already been read.', 409));
    }
    return next(new error_response_1.default('Could not find Alert Email, please try again.', 404));
}));
