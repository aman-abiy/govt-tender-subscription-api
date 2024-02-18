"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AD_IMPRESSION_TYPES = exports.ADVERTISEMENT_TYPES = exports.ACCOUNT_TYPES = exports.EMAIL_TYPES = exports.sort = void 0;
var sort;
(function (sort) {
    sort[sort["asc"] = 0] = "asc";
    sort[sort["desc"] = 1] = "desc";
})(sort = exports.sort || (exports.sort = {}));
var EMAIL_TYPES;
(function (EMAIL_TYPES) {
    EMAIL_TYPES[EMAIL_TYPES["alert"] = 0] = "alert";
    EMAIL_TYPES[EMAIL_TYPES["auth"] = 1] = "auth";
})(EMAIL_TYPES = exports.EMAIL_TYPES || (exports.EMAIL_TYPES = {}));
var ACCOUNT_TYPES;
(function (ACCOUNT_TYPES) {
    ACCOUNT_TYPES[ACCOUNT_TYPES["root"] = 0] = "root";
    ACCOUNT_TYPES[ACCOUNT_TYPES["admin"] = 1] = "admin";
    ACCOUNT_TYPES[ACCOUNT_TYPES["sales-coordinator"] = 2] = "sales-coordinator";
    ACCOUNT_TYPES[ACCOUNT_TYPES["encoder"] = 3] = "encoder";
    ACCOUNT_TYPES[ACCOUNT_TYPES["editor"] = 4] = "editor";
    ACCOUNT_TYPES[ACCOUNT_TYPES["user"] = 5] = "user";
})(ACCOUNT_TYPES = exports.ACCOUNT_TYPES || (exports.ACCOUNT_TYPES = {}));
var ADVERTISEMENT_TYPES;
(function (ADVERTISEMENT_TYPES) {
    ADVERTISEMENT_TYPES[ADVERTISEMENT_TYPES["card"] = 0] = "card";
    ADVERTISEMENT_TYPES[ADVERTISEMENT_TYPES["banner"] = 1] = "banner";
})(ADVERTISEMENT_TYPES = exports.ADVERTISEMENT_TYPES || (exports.ADVERTISEMENT_TYPES = {}));
var AD_IMPRESSION_TYPES;
(function (AD_IMPRESSION_TYPES) {
    AD_IMPRESSION_TYPES[AD_IMPRESSION_TYPES["view"] = 0] = "view";
    AD_IMPRESSION_TYPES[AD_IMPRESSION_TYPES["click"] = 1] = "click";
})(AD_IMPRESSION_TYPES = exports.AD_IMPRESSION_TYPES || (exports.AD_IMPRESSION_TYPES = {}));
