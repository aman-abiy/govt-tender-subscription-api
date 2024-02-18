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
exports.generateInvoiceId = exports.generateInvoice = void 0;
const easyinvoice_1 = __importDefault(require("easyinvoice"));
const fs_1 = __importDefault(require("fs"));
const statics_config_1 = require("../config/statics.config");
const generateInvoice = (subscriptionPlan, paymentDate) => __awaiter(void 0, void 0, void 0, function* () {
    let products = [];
    let product1 = {
        quantity: "1",
        description: `${subscriptionPlan.name} subscription for tender information provision service and alert`,
        tax: statics_config_1.VAT,
        price: subscriptionPlan.price
    };
    products.push(product1);
    console.log('paymentDate', paymentDate, typeof (paymentDate));
    let invoiceId = (0, exports.generateInvoiceId)();
    const data = {
        "documentTitle": "RECEIPT",
        "locale": "en-US",
        "currency": "ETB",
        "taxNotation": "vat",
        "marginTop": 25,
        "marginRight": 25,
        "marginLeft": 25,
        "marginBottom": 25,
        "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
        "sender": {
            "company": "arppo technologies",
            "address": "Megenagna around Israel Embassy",
            "zip": "864",
            "city": "Addis Ababa",
            "country": "Ethiopia"
        },
        "client": {
            "company": '-',
            "address": '-',
            "zip": "-",
            "city": '-',
            "country": '-'
        },
        "invoiceNumber": invoiceId.toString(),
        "invoiceDate": paymentDate.toString().slice(0, 10),
        "products": products,
        "bottomNotice": "Thank you for choosing Alpha Tenders! \n We're sure you will meet your demands with our products."
    };
    let fileName = `${invoiceId}_${paymentDate.getTime()}.pdf`;
    //Create your invoice! Easy!
    yield easyinvoice_1.default.createInvoice(data, function (result) {
        //The response will contain a base64 encoded PDF file
        fs_1.default.writeFileSync(`${process.env.INVOICE_DIR}/${fileName}`, result.pdf, 'base64');
    });
    return {
        invoiceId,
        fileName
    };
});
exports.generateInvoice = generateInvoice;
const generateInvoiceId = () => {
    return Math.floor(Math.random() * 1000000000);
};
exports.generateInvoiceId = generateInvoiceId;
