"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAYS_OF_THE_WEEK = exports.DEFAULT_LAST_X_DAYS_USER_STATS_FETCH = exports.DEFAULT_BONUS_TRESHOLD = exports.DEFAULT_COMMISSIONS_PERCENTAGE = exports.PASSWORD_RESET_ROUTE = exports.EMAIL_VERIFICATION_ROUTE = exports.PACKAGES_ROUTE = exports.HOME_ROUTE = exports.TENDER_IMGS_DIR = exports.ADVERTISEMENT_DIR = exports.INVOICE_DIR = exports.ADMIN_ROLES = exports.DATE_OPTIONS = exports.VAT_PERCENTAGES = exports.ROLE_PERMISSION_ERROR_MSG = exports.BACKUP_DIR = exports.EMAIL_PASSWORD = exports.COMPANY_PHONE_NUMBER_2 = exports.COMPANY_PHONE_NUMBER_1 = exports.PROMO_EMAIL_SENDER = exports.AUTH_EMAIL_SENDER = exports.ALERT_SENDER = exports.VAT = exports.EMAIL_TYPE_AUTH = exports.EMAIL_TYPE_ALERT = exports.countries = exports.regions = void 0;
exports.regions = [
    'Addis Ababa',
    'Amhara'
];
exports.countries = [
    'Ethiopia'
];
exports.EMAIL_TYPE_ALERT = 'alert';
exports.EMAIL_TYPE_AUTH = 'auth';
exports.VAT = 15;
exports.ALERT_SENDER = 'alert@alphatenders.com';
exports.AUTH_EMAIL_SENDER = 'info@alphatenders.com';
exports.PROMO_EMAIL_SENDER = 'info@alphatenders.com';
exports.COMPANY_PHONE_NUMBER_1 = '+251948016062';
exports.COMPANY_PHONE_NUMBER_2 = '+251961138866';
exports.EMAIL_PASSWORD = '0961138866Amex';
exports.BACKUP_DIR = 'backups';
exports.ROLE_PERMISSION_ERROR_MSG = 'You don not have the required role permission.';
exports.VAT_PERCENTAGES = 0.15;
exports.DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
exports.ADMIN_ROLES = ['root', 'admin', 'sales-coordinator', 'encoder', 'editor'];
exports.INVOICE_DIR = 'documents/invoice';
exports.ADVERTISEMENT_DIR = 'documents/advertisments';
exports.TENDER_IMGS_DIR = 'documents/tender_imgs';
exports.HOME_ROUTE = 'https://alphatenders.com';
exports.PACKAGES_ROUTE = 'https://alphatenders.com/#/packages';
exports.EMAIL_VERIFICATION_ROUTE = 'https://alphatenders.com/#/verify';
exports.PASSWORD_RESET_ROUTE = 'https://alphatenders.com/#/reset-password';
// out of 100
exports.DEFAULT_COMMISSIONS_PERCENTAGE = 10;
exports.DEFAULT_BONUS_TRESHOLD = 29700;
exports.DEFAULT_LAST_X_DAYS_USER_STATS_FETCH = 10;
exports.DAYS_OF_THE_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
