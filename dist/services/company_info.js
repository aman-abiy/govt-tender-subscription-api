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
exports.getCompanyInfo = exports.addCompanyInfo = void 0;
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const Company_Info_Model_1 = require("../models/Company_Info_Model");
const request_body_dtos_1 = require("../utils/types/request_body_dtos");
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
exports.addCompanyInfo = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let companyInfoBody;
    companyInfoBody = (0, request_body_dtos_1.companyInfoBodyCast)(req.body);
    const companyInfo = yield Company_Info_Model_1.CompanyInfoModel.create(companyInfoBody);
    if (companyInfo) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: companyInfo });
    }
    return next(new error_response_1.default('Could not add Company Info. Try again.', 500));
}));
exports.getCompanyInfo = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const companyInfo = yield Company_Info_Model_1.CompanyInfoModel.find();
    if (companyInfo) {
        if (companyInfo[0]) {
            return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: companyInfo[0] });
        }
        return next(new error_response_1.default('Company Info not found.', 404));
    }
    return next(new error_response_1.default('Could not get Company Info.', 500));
}));
