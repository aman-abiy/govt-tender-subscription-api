"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSubscriptionEndDate = void 0;
const calculateSubscriptionEndDate = (subscriptionPlan, startDate) => {
    let endDate;
    // set startDate to beginning(00:00) of subscription date
    startDate = new Date(new Date(startDate.getTime()).setUTCHours(0, 1, 0, 0));
    endDate = new Date(new Date(startDate.getTime() + subscriptionPlan.duration).setUTCHours(23, 59, 0, 0));
    return {
        startDate,
        endDate
    };
};
exports.calculateSubscriptionEndDate = calculateSubscriptionEndDate;
