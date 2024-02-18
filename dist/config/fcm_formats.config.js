"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribedAccountsWithNoAlertFCM = exports.subscribedAccountsWithAlertFCM = exports.notSubscribedAccountsFCM = void 0;
const notSubscribedAccountsFCM = (toodaysTendersCount) => {
    return `We have released ${toodaysTendersCount} tenders today. Start your subscription and get access to all tenders released in the country.`;
};
exports.notSubscribedAccountsFCM = notSubscribedAccountsFCM;
const subscribedAccountsWithAlertFCM = (toodaysTendersCount, alertTendersCount) => {
    return `Out of ${toodaysTendersCount} tenders released today, ${alertTendersCount} tenders match your selection. You can open the app and follow up on the latest tenders.`;
};
exports.subscribedAccountsWithAlertFCM = subscribedAccountsWithAlertFCM;
const subscribedAccountsWithNoAlertFCM = (toodaysTendersCount) => {
    return `We have released ${toodaysTendersCount} tenders today, you can open the app and read.`;
};
exports.subscribedAccountsWithNoAlertFCM = subscribedAccountsWithNoAlertFCM;
