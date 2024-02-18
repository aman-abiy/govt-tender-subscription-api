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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHandler = void 0;
const paginationHandler = ({ queryPage: queryPage, queryLimit: queryLimit, query: query, Schema: Schema }) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(queryPage) || 1;
    const limit = parseInt(queryLimit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = yield Schema.countDocuments(query);
    let pagination = {
        next: {},
        prev: {}
    };
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }
    let metaData;
    metaData = {
        startIndex,
        limit,
        pagination,
        currentPage: page,
        total
    };
    return metaData;
});
exports.paginationHandler = paginationHandler;
