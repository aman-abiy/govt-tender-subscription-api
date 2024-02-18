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
exports.getCategory = exports.importAllCategories = void 0;
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const mongoose_1 = __importDefault(require("mongoose"));
const Category_Model_1 = require("../models/Category_Model");
const response_handler_1 = require("../utils/response_handler");
const pagination_1 = require("../utils/pagination");
const error_response_1 = __importDefault(require("../utils/error_response"));
const rawCategories = require('../../categories.json');
exports.importAllCategories = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let category = {};
    let childCategory = {};
    let categories = [];
    let childCategories = [];
    rawCategories.forEach((e) => {
        category._id = new mongoose_1.default.Types.ObjectId(e.id);
        category.name = e.name;
        if (e.children != null) {
            if (e.children.length > 0) {
                category.isParent = true;
                category.hasParent = false;
                category.children = e.children.map((e) => new mongoose_1.default.Types.ObjectId(e));
                category.createdAt = new Date(Date.now());
                category.createdBy = new mongoose_1.default.Types.ObjectId('6218c6437afaa15c03330f95');
                e.children.forEach((e) => {
                    childCategory._id = e.id;
                    childCategory.name = e.name;
                    childCategory.isParent = false;
                    childCategory.hasParent = true;
                    childCategory.children = e.children;
                    childCategory.createdAt = new Date(Date.now());
                    childCategory.createdBy = new mongoose_1.default.Types.ObjectId('6218c6437afaa15c03330f95');
                    childCategories.push(childCategory);
                    childCategory = {};
                });
            }
            else {
                category.isParent = false;
                category.hasParent = false;
            }
        }
        else {
            category.isParent = true;
            category.hasParent = false;
            category.children = [];
            category.createdAt = new Date(Date.now());
            category.createdBy = new mongoose_1.default.Types.ObjectId('6218c6437afaa15c03330f95');
        }
        categories.push(category);
        category = {};
    });
    childCategories.forEach((e) => categories.push(e));
    // categories.forEach((e) => {
    //     if(e.isParent == null) { 
    //         console.log(e.name)
    //     }
    // })
    console.log(categories.length);
    let insertedCategories = yield Category_Model_1.CategoryModel.insertMany(categories);
    if (insertedCategories != null) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 201, data: insertedCategories });
    }
}));
exports.getCategory = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, isParent, isActive, isDeleted, createdBy, createdAt, sort, page, limit } = req.query;
    let categoryQuery = {};
    categoryQuery.or = [{ isParent: true }, { hasParent: false }];
    categoryQuery.isDeleted = false;
    if (id) {
        categoryQuery._id = new mongoose_1.default.Types.ObjectId(id.toString());
    }
    if (isParent != null) {
        categoryQuery.isParent = (isParent == 'true' ? true : false);
    }
    if (isActive != null) {
        categoryQuery.isActive = (isActive == 'true' ? true : false);
    }
    if (isDeleted != null) {
        categoryQuery.isDeleted = (isDeleted == 'true' ? true : false);
    }
    if (createdBy) {
        categoryQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    if (createdAt) {
        categoryQuery.createdAt = new Date(createdAt.toString());
    }
    const paginationData = yield (0, pagination_1.paginationHandler)({ queryPage: page === null || page === void 0 ? void 0 : page.toString(), queryLimit: limit === null || limit === void 0 ? void 0 : limit.toString(), Schema: Category_Model_1.CategoryModel });
    const categories = yield Category_Model_1.CategoryModel.find(Object.assign(Object.assign({}, categoryQuery), { $or: categoryQuery.or }))
        .populate('children');
    if (categories) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: categories, metaData: paginationData });
    }
    return next(new error_response_1.default('No Tender Category found.', 404));
}));
