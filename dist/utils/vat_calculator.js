"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateVat = void 0;
const calculateVat = (totalPrice, percentage) => {
    let price = parseFloat((totalPrice / (1 + percentage)).toFixed(2));
    let vat = parseFloat((totalPrice - price).toFixed(2));
    return {
        price,
        vat
    };
};
exports.calculateVat = calculateVat;
