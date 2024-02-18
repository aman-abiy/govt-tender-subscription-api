"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarkedTenderBodyCast = exports.adImpressionBodyCast = exports.advertisementBodyCast = exports.companyBodyCast = exports.companyInfoBodyCast = exports.emailResultBodyCast = exports.subscriptionPlanBodyCast = exports.currencyBodyCast = exports.paymentMethodBodyCast = exports.bankBodyCast = exports.accountBodyCast = exports.tenderBodyCast = exports.tenderSourceBodyCast = exports.countryBodyCast = exports.regionBodyCast = exports.languageBodyCast = exports.alertCategoryBodyCast = exports.subscriptionBodyCast = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionBodyCast = (body) => {
    console.log('subscriptionBody.paymentDate', new Date(parseInt(body.paymentDate)));
    let subscriptionBody = Object.assign(Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), (body.account != null ? { account: new mongoose_1.default.Types.ObjectId(body.account.toString()) } : {})), { isPaid: body.isPaid, paymentMethod: new mongoose_1.default.Types.ObjectId(body.paymentMethod.toString()), currency: new mongoose_1.default.Types.ObjectId(body.currency.toString()), payment: body.payment ? new mongoose_1.default.Types.ObjectId(body.payment.toString()) : null, paymentDate: new Date(parseInt(body.paymentDate)), bank: new mongoose_1.default.Types.ObjectId(body.bank.toString()), invoiceId: body.invoiceId ? parseInt(body.invoiceId) : null, invoicePDF: body.invoicePDF ? body.invoicePDF.toString() : null, transactionRef: body.transactionRef.toString(), subscriptionPlan: new mongoose_1.default.Types.ObjectId(body.subscriptionPlan.toString()), startDate: new Date(parseInt(body.startDate)), endDate: body.endDate ? new Date(parseInt(body.endDate)) : null, createdBy: body.createdBy ? new mongoose_1.default.Types.ObjectId(body.createdBy.toString()) : null });
    return subscriptionBody;
};
exports.subscriptionBodyCast = subscriptionBodyCast;
const alertCategoryBodyCast = (body) => {
    let alertCategoryBody = {
        categories: body.categories.map((e) => new mongoose_1.default.Types.ObjectId(e))
    };
    return alertCategoryBody;
};
exports.alertCategoryBodyCast = alertCategoryBodyCast;
const languageBodyCast = (body) => {
    let languageBody = Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { iso: body.iso, iso3: body.iso3, name: body.name, createdBy: new mongoose_1.default.Types.ObjectId });
    return languageBody;
};
exports.languageBodyCast = languageBodyCast;
const regionBodyCast = (body) => {
    let regionBody = Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { name: body.name ? {
            en: body.name.en,
            am: body.name.am
        } : null, slug: '', country: new mongoose_1.default.Types.ObjectId(body.country), createdBy: new mongoose_1.default.Types.ObjectId });
    return regionBody;
};
exports.regionBodyCast = regionBodyCast;
const countryBodyCast = (body) => {
    let countryBody = Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { name: body.name ? {
            en: body.name.en,
            am: body.name.am
        } : null, slug: '', createdBy: new mongoose_1.default.Types.ObjectId });
    return countryBody;
};
exports.countryBodyCast = countryBodyCast;
const tenderSourceBodyCast = (body) => {
    let tenderSourceBodyBody = Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { name: body.name ? {
            en: body.name.en,
            am: body.name.am
        } : null, createdBy: new mongoose_1.default.Types.ObjectId });
    return tenderSourceBodyBody;
};
exports.tenderSourceBodyCast = tenderSourceBodyCast;
const tenderBodyCast = (body) => {
    var _a, _b;
    let tenderSourceBodyBody = Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { site_id: body.site_id, region: body.region ? new mongoose_1.default.Types.ObjectId(body.region) : null, language: body.language ? new mongoose_1.default.Types.ObjectId(body.language) : null, tenderSources: (_a = body.tenderSources) === null || _a === void 0 ? void 0 : _a.map((e) => new mongoose_1.default.Types.ObjectId(e)), categories: (_b = body.categories) === null || _b === void 0 ? void 0 : _b.map((e) => new mongoose_1.default.Types.ObjectId(e)), company: body.company ? new mongoose_1.default.Types.ObjectId(body.company) : null, bidBond: body.bidBond, bidOpeningDate: new Date(parseInt(body.bidOpeningDate)), bidClosingDate: new Date(parseInt(body.bidClosingDate)), isPublished: body.isPublished, isFeatured: body.isFeatured, isActive: body.isActive, isDeleted: body.isDeleted, lastUpdatedAt: new Date(), lastUpdatedBy: new mongoose_1.default.Types.ObjectId, createdBy: new mongoose_1.default.Types.ObjectId });
    return tenderSourceBodyBody;
};
exports.tenderBodyCast = tenderBodyCast;
const accountBodyCast = (body) => {
    var _a, _b, _c;
    let accountBody = Object.assign(Object.assign(Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { fname: body.fname, lname: body.lname, email: body.email, mobile: body.mobile, password: body.password, fcmToken: body.fcmToken, mobileDeviceInfo: body.mobileDeviceInfo }), (body.roles != null ? { roles: body.roles } : {})), { deviceInfo: body.deviceInfo, company: body.company ? new mongoose_1.default.Types.ObjectId(body === null || body === void 0 ? void 0 : body.company) : null, alertStatus: body.alertStatus, alertLanguages: (_a = body.alertLanguages) === null || _a === void 0 ? void 0 : _a.map((e) => new mongoose_1.default.Types.ObjectId(e)), alertRegions: (_b = body.alertRegions) === null || _b === void 0 ? void 0 : _b.map((e) => new mongoose_1.default.Types.ObjectId(e)), alertCategories: (_c = body.alertCategories) === null || _c === void 0 ? void 0 : _c.map((e) => new mongoose_1.default.Types.ObjectId(e)), isActive: body.isActive, isDeleted: body.isDeleted, lastUpdatedAt: new Date(), lastUpdatedBy: null, createdBy: null });
    return accountBody;
};
exports.accountBodyCast = accountBodyCast;
const bankBodyCast = (body) => {
    let bankBody = Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { name: body.name, iso3: body.iso3, accountName: body.accountName, accountNumber: body.accountNumber, swiftCode: body.swiftCode, isActive: body.isActive, isDeleted: body.isDeleted, isUserViewable: body.isUserViewable, lastUpdatedAt: new Date(), lastUpdatedBy: new mongoose_1.default.Types.ObjectId, createdBy: new mongoose_1.default.Types.ObjectId });
    return bankBody;
};
exports.bankBodyCast = bankBodyCast;
const paymentMethodBodyCast = (body) => {
    let paymentMethodBody = {
        _id: body._id ? new mongoose_1.default.Types.ObjectId(body._id) : null,
        name: body.name,
        isActive: body.isActive,
        isDeleted: body.isDeleted,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: new mongoose_1.default.Types.ObjectId,
        createdBy: new mongoose_1.default.Types.ObjectId
    };
    return paymentMethodBody;
};
exports.paymentMethodBodyCast = paymentMethodBodyCast;
const currencyBodyCast = (body) => {
    let currencyBody = Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { name: body.name, iso3: body.iso3, isActive: body.isActive, isDeleted: body.isDeleted, lastUpdatedAt: new Date(), lastUpdatedBy: new mongoose_1.default.Types.ObjectId, createdBy: new mongoose_1.default.Types.ObjectId });
    return currencyBody;
};
exports.currencyBodyCast = currencyBodyCast;
const subscriptionPlanBodyCast = (body) => {
    let subscriptionPlanBody = Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { name: body.name, price: body.price, vat: body.vat, totalPrice: body.totalPrice, duration: body.duration, isUserSelectable: body.isUserSelectable, isActive: body.isActive, isDeleted: body.isDeleted, lastUpdatedAt: new Date(), lastUpdatedBy: new mongoose_1.default.Types.ObjectId, createdBy: new mongoose_1.default.Types.ObjectId });
    return subscriptionPlanBody;
};
exports.subscriptionPlanBodyCast = subscriptionPlanBodyCast;
const emailResultBodyCast = (body) => {
    var _a;
    let emailResultBody = Object.assign(Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), (body.account != null ? { account: new mongoose_1.default.Types.ObjectId(body.account.toString()) } : {})), { tenders: (_a = body.tenders) === null || _a === void 0 ? void 0 : _a.map((e) => new mongoose_1.default.Types.ObjectId(e)), sentToEmail: body.sentToEmail, type: body.type, isSent: body.isSent, isOpened: body.isOpened, readCheckKey: body.readCheckKey, openedAt: body.openedAt, isDeleted: body.isDeleted });
    return emailResultBody;
};
exports.emailResultBodyCast = emailResultBodyCast;
const companyInfoBodyCast = (body) => {
    let companyInfoBody = Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { name: body.name, address: body.address, region: body.region != null ? new mongoose_1.default.Types.ObjectId(body.region) : null, country: body.country != null ? new mongoose_1.default.Types.ObjectId(body.country) : null, phone1: body.phone1, phone2: body.phone2, phone3: body.phone3, tin: body.tin, email: body.email, website: body.website, telegram: body.telegram, isActive: body.isActive, isDeleted: body.isDeleted });
    return companyInfoBody;
};
exports.companyInfoBodyCast = companyInfoBodyCast;
const companyBodyCast = (body) => {
    let companyBody = Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { name: body.name, address: body.address, region: body.region != null ? new mongoose_1.default.Types.ObjectId(body.region) : null, country: body.country != null ? new mongoose_1.default.Types.ObjectId(body.country) : null, phone1: body.phone1, phone2: body.phone2, phone3: body.phone3, tin: body.tin, email: body.email, website: body.website, isActive: body.isActive, isDeleted: body.isDeleted });
    return companyBody;
};
exports.companyBodyCast = companyBodyCast;
const advertisementBodyCast = (body) => {
    let advertisementBody = Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { bannerTitle: body.bannerTitle, bannerDescription: body.bannerDescription, hyperlink: body.hyperlink, bannerImage: body.bannerImage, themeColorHex: body.themeColorHex, company: new mongoose_1.default.Types.ObjectId(body.company.toString()), type: body.type, isActive: body.isActive, isDeleted: body.isDeleted, lastUpdatedAt: new Date(), lastUpdatedBy: new mongoose_1.default.Types.ObjectId, createdBy: new mongoose_1.default.Types.ObjectId });
    return advertisementBody;
};
exports.advertisementBodyCast = advertisementBodyCast;
const adImpressionBodyCast = (body) => {
    let adImpressionBody = Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { type: body.type, advertisement: new mongoose_1.default.Types.ObjectId(body.advertisement.toString()), isActive: body.isActive, isDeleted: body.isDeleted, createdBy: new mongoose_1.default.Types.ObjectId });
    return adImpressionBody;
};
exports.adImpressionBodyCast = adImpressionBodyCast;
const bookmarkedTenderBodyCast = (body) => {
    let bookmarkedTenderBody = Object.assign(Object.assign({}, (body._id != null ? { _id: new mongoose_1.default.Types.ObjectId(body._id.toString()) } : {})), { account: body.account, tender: body.tender, isRemoved: body.isRemoved, isDeleted: body.isDeleted });
    return bookmarkedTenderBody;
};
exports.bookmarkedTenderBodyCast = bookmarkedTenderBodyCast;
