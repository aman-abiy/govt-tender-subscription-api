import nodemailer from 'nodemailer'
import { AUTH_EMAIL_SENDER, ALERT_SENDER, PROMO_EMAIL_SENDER, EMAIL_PASSWORD } from '../config/statics.config';
import { MailOptions, SendEmailResponse } from '../utils/types/method_return_dtos';

/* Auth emails are emails sent to users relatied to some authentication actions, eg: [signup, password reset...] */

export const sendAuthEmail = async(mailOptions: MailOptions) : Promise<boolean> => {

    // send email
    var transporter: nodemailer.Transporter = nodemailer.createTransport({
        host: 'mail.alphatenders.com',
        secure: true,
        auth: {
            user: AUTH_EMAIL_SENDER,
            pass: EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    transporter.sendMail(mailOptions, function(error: Error, info: nodemailer.SentMessageInfo) {
        if (error) {
            return false
        } else {
            return true
        }
    });

    return true
}

/* Alert emails are tender alert emails sent every 24 hours based on the users alert preference selection */

export const sendAlertEmail = async(mailOptions: MailOptions) : Promise<boolean> => {
    let status: boolean = true
    // send email
    var transporter = nodemailer.createTransport({
        pool: true,
        host: 'mail.alphatenders.com',
        secure: true,
        auth: {
            user: ALERT_SENDER,
            pass: EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    transporter.sendMail(mailOptions, function(error: Error, info: nodemailer.SentMessageInfo) {
        if (error) status = false
        else status = true
    });

    return status
}

/* Alert emails are tender alert emails sent every 24 hours based on the users alert preference selection */

export const sendPromoEmail = async(mailOptions: MailOptions) : Promise<boolean> => {
    let status: boolean = true
    // send email
    var transporter = nodemailer.createTransport({
        pool: true,
        host: 'mail.alphatenders.com',
        secure: true,
        auth: {
            user: PROMO_EMAIL_SENDER,
            pass: EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    transporter.sendMail(mailOptions, function(error: Error, info: nodemailer.SentMessageInfo) {
        if (error) status = false
        else status = true
    });

    return status
}