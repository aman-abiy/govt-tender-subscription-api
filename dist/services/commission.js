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
exports.getCommissionsList = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_1 = __importDefault(require("../middleware/async_handler"));
const response_handler_1 = require("../utils/response_handler");
const error_response_1 = __importDefault(require("../utils/error_response"));
const Payment_Model_1 = require("../models/Payment_Model");
const statics_config_1 = require("../config/statics.config");
exports.getCommissionsList = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let { startDate, endDate, createdBy } = req.query;
    console.log('req.query C', req.query);
    let commissionsQuery = {};
    commissionsQuery.isPaid = true;
    if (startDate && endDate) {
        commissionsQuery.createdAt = { $gte: new Date(parseInt(startDate.toString())), $lt: new Date(parseInt(endDate.toString())) };
    }
    if (createdBy) {
        commissionsQuery.createdBy = new mongoose_1.default.Types.ObjectId(createdBy.toString());
    }
    console.log('commissionsQuery C', commissionsQuery);
    let payments = yield Payment_Model_1.PaymentModel.aggregate([
        {
            $match: commissionsQuery
        },
        {
            $lookup: {
                from: 'accounts',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy',
                pipeline: [
                    {
                        $project: {
                            fname: 1,
                            lname: 1,
                        },
                    }
                ]
            }
        },
        {
            $unwind: "$createdBy"
        },
        {
            $group: {
                _id: "$createdBy",
                count: { $sum: 1 },
                total: {
                    $sum: "$price"
                }
            }
        },
        {
            $project: {
                total: {
                    $multiply: [
                        (((_a = commissionsQuery.commissionPercentage) !== null && _a !== void 0 ? _a : statics_config_1.DEFAULT_COMMISSIONS_PERCENTAGE) / 100), '$total'
                    ]
                },
                bonus: {
                    $multiply: [
                        {
                            $floor: {
                                $divide: ['$total', (_b = commissionsQuery.bonusThreshold) !== null && _b !== void 0 ? _b : statics_config_1.DEFAULT_BONUS_TRESHOLD]
                            }
                        }, 1000
                    ]
                },
                count: '$count'
            }
        },
    ]);
    console.log('payments', payments);
    if (payments) {
        return (0, response_handler_1.responseHandler)({ res: res, status: true, statusCode: 200, data: payments });
    }
    return next(new error_response_1.default('No commisions data found.', 500));
}));
