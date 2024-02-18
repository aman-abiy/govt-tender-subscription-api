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
exports.getAlertTenders = void 0;
const Tender_Model_1 = require("../models/Tender_Model");
const functions_1 = require("./functions");
const getAlertTenders = (account) => __awaiter(void 0, void 0, void 0, function* () {
    let dates = (0, functions_1.getStartEndDate)();
    // fetch tenders of today based on this users category selection and format mail options accordingly
    let tenders = yield Tender_Model_1.TenderModel.find({
        createdAt: { $gte: new Date(dates.startDate).toISOString(), $lt: new Date(dates.endDate).toISOString() },
        $and: [
            Object.assign({}, ((account.alertRegions != null && account.alertRegions.length > 0) ? { region: {
                    "$in": account.alertRegions
                } } : {})),
            Object.assign({}, ((account.alertCategories != null && account.alertCategories.length > 0) ? { categories: {
                    "$in": account.alertCategories
                } } : {}))
        ]
    }).populate('tenderSources');
    return [tenders, tenders.length];
});
exports.getAlertTenders = getAlertTenders;
