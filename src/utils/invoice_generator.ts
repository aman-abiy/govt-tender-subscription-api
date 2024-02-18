import mongoose from 'mongoose';
import easyinvoice, { InvoiceProduct } from 'easyinvoice'
import fs from 'fs'
import SubscriptionPlan from '../interfaces/Subscription_Plan';
import { SubscriptionPlanModel } from '../models/Subscription_Plan_Model';
import { InvoiceReturn } from './types/method_return_dtos';
import { VAT } from '../config/statics.config'

export const generateInvoice = async(subscriptionPlan: SubscriptionPlan, paymentDate: Date) : Promise<InvoiceReturn> => {
    let products: Array<InvoiceProduct> = [];

    let product1: InvoiceProduct = {
        quantity: "1",
        description: `${subscriptionPlan.name} subscription for tender information provision service and alert`,
        tax: VAT,
        price: subscriptionPlan.price
    }

    products.push(product1)

    console.log('paymentDate', paymentDate, typeof(paymentDate))

    let invoiceId: number = generateInvoiceId()

    const data = {
        "documentTitle": "RECEIPT",
        "locale": "en-US",
        "currency": "ETB",
        "taxNotation": "vat",
        "marginTop": 25,
        "marginRight": 25,
        "marginLeft": 25,
        "marginBottom": 25,
        "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png", //or base64
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

    let fileName: string = `${invoiceId}_${paymentDate.getTime()}.pdf`

    //Create your invoice! Easy!
    await easyinvoice.createInvoice(data, function(result) {
        //The response will contain a base64 encoded PDF file
        fs.writeFileSync(`${process.env.INVOICE_DIR}/${fileName}`, result.pdf, 'base64')
    });

    return {
        invoiceId,
        fileName
    } 
}

export const generateInvoiceId = () => {
    return Math.floor(Math.random() * 1000000000)
}