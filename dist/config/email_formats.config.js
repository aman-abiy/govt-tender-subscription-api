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
exports.promoEmail = exports.alertEmail = exports.passwordResetEmail = exports.emailVerification = exports.welcomeEmail = void 0;
const functions_1 = require("../utils/functions");
const statics_config_1 = require("./statics.config");
const alert_tenders_1 = require("../utils/alert_tenders");
const welcomeEmail = (account, verificationLink) => {
    var mailOptions = {
        from: 'Alpha Tenders <info@alphatenders.com>',
        to: account.email,
        subject: 'Welcome to Alpha Tenders',
        html: `<html>
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!--bootstrap-->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
        
            <style>
            body {
                width: 100%;
                background-color: #eff2f4;
            }
            .tender-body {
                width: 50%;
                position: relative;
                left: 25%;
            }
            .alert {
                font-size: 15px;
                font-weight: 400;
            }
            .tender-card-sub-texts {
                font-size: 13px;
                line-height: 7px;
            } 
            .tender-card-sub-texts .values {
                margin-left: 10px;
            } 
            .btn-email-confirmation {
                background-color: #1e4384;
                color: #eaecee;
                border-radius: 50px;
            }  
            .btn-email-confirmation:hover {
                background-color: #1e4384;
                color: #eaecee;
                border-radius: 50px;
            }
            </style>
            </head>
            
            <body>
                <div class="tender-body">
                    <hr>
                    <h6 class="text-center">Alpha Tenders</h6>
                    <hr>
                    <h4 class="text-center welcome-title">Welcome to Alpha Tenders!</h4>
                    <br/>
                    <p>You have successfully registered on <a href="${statics_config_1.HOME_ROUTE}">alphatenders.com</a> and this is your confirmation email. Start your subscription now and get easy and organized access to tenders (ጨርታ) released in Ethiopia.</p> 
                    <div class="d-flex justify-content-center">
                        <p><a href="${verificationLink}" class="btn btn-email-confirmation text-center">Click here to confirm your email</a></p>
                    </div>
                    <p>To start your subscription, call us on <a href="tel:${statics_config_1.COMPANY_PHONE_NUMBER_1}">${statics_config_1.COMPANY_PHONE_NUMBER_1}</a> or <a href="tel:${statics_config_1.COMPANY_PHONE_NUMBER_2}">${statics_config_1.COMPANY_PHONE_NUMBER_2}</a>. Click <a href="${statics_config_1.PACKAGES_ROUTE}">here</a> to view subscription packages we provide.</p>
                    <hr>
                    <p class="text-center">copyright &copy <a href="${statics_config_1.HOME_ROUTE}">alphatenders.com</a> </p>
                    <hr>
                </div>              
            </body>
        </html>`
    };
    return mailOptions;
};
exports.welcomeEmail = welcomeEmail;
const emailVerification = (account, verificationLink) => {
    var mailOptions = {
        from: 'Alpha Tenders <info@alphatenders.com>',
        to: account.email,
        subject: 'Please verify your email',
        html: `<html>
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <!--bootstrap-->
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
            
                <!--fonts-->
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Domine:wght@700&family=Encode+Sans+SC:wght@500&display=swap" rel="stylesheet">
                <title>Document</title>
                <style>
                    html {
                        width: 60%;
                        position: relative;
                        left: 20%;
                    }
                    
                    body {
                        background-color: #FFFFFF;
                    }
                    
                    h3 {
                        font-weight: 600;
                        color: #223d8c;
                        font-family: "Montserrat", "Arial", sans-serif;
                        ;
                    }
                    
                    h3 span {
                        font-weight: 600;
                        color: #e19240;
                        margin-left: 10px;
                    }
                    
                    .title-background {
                        background-color: rgb(247, 245, 245);
                    }
                    
                    .welcome-text {
                        font-family: "Montserrat", "Arial", sans-serif;
                    }

                    .welcome-text .admin-name {
                        font-weight: 600;
                        color: rgb(77, 77, 77);
                    }
                    
                    .copyright {
                        color: grey;
                        font-size: 13px;
                    }
                </style>
            </head>
            
            <body>
                <div class="container">
                    <br>
                    <h5 class="text-center welcome-text"><span class="admin-name">${account.fname}</span>, welcome to Lelije. Here are your account details</h5>
                    <br>
                    <div class="container">
                        <p><strong>Email: ${account.email} </strong></p>
                    </div>
                    <br>
                    <p class="text-center text-secondary"><strong>Note: </strong>to change account details please contact <span class="text-primary">info@alphatenders.com</span></p>
                    <br>
                    <hr>
                    <p class="copyright">${new Date().getFullYear()} &copy; AlphaTenders.com</p>
                </div>
            </body>
        </html>`
    };
    return mailOptions;
};
exports.emailVerification = emailVerification;
const passwordResetEmail = (account, passwordResetLink) => {
    var mailOptions = {
        from: 'Alpha Tenders <info@alphatenders.com>',
        to: account.email,
        subject: 'Passwords reset email',
        html: `<html>
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <!--bootstrap-->
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
            
                <!--fonts-->
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Domine:wght@700&family=Encode+Sans+SC:wght@500&display=swap" rel="stylesheet">
                <title>Document</title>
                <style>
                    html {
                        width: 60%;
                        position: relative;
                        left: 20%;
                    }
                    
                    body {
                        background-color: #FFFFFF;
                    }
                    
                    h3 {
                        font-weight: 600;
                        color: #223d8c;
                        font-family: "Montserrat", "Arial", sans-serif;
                        ;
                    }
                    
                    h3 span {
                        font-weight: 600;
                        color: #e19240;
                        margin-left: 10px;
                    }
                    
                    .title-background {
                        background-color: rgb(247, 245, 245);
                    }
                    
                    .welcome-text {
                        font-family: "Montserrat", "Arial", sans-serif;
                    }

                    .welcome-text .admin-name {
                        font-weight: 600;
                        color: rgb(77, 77, 77);
                    }
                    
                    .copyright {
                        color: grey;
                        font-size: 13px;
                    }
                </style>
            </head>
            
            <body>
                <div class="container">
                    <br>
                    <h5 class="text-center welcome-text"><span class="admin-name">${account.fname}</span>, welcome to Lelije. Here are your account details</h5>
                    <br>
                    <div class="container">
                        <p><strong>Email: ${account.email} </strong></p>
                    </div>
                    <br>
                    <p class="text-center text-secondary"><strong>Note: </strong>to change account details please contact <span class="text-primary">info@alphatenders.com</span></p>
                    <br>
                    <hr>
                    <p class="copyright">${new Date().getFullYear()} &copy; AlphaTenders.com</p>
                </div>
            </body>
        </html>`
    };
    return mailOptions;
};
exports.passwordResetEmail = passwordResetEmail;
const alertEmail = (account) => __awaiter(void 0, void 0, void 0, function* () {
    let dates = (0, functions_1.getStartEndDate)();
    let [tenders, count] = yield (0, alert_tenders_1.getAlertTenders)(account);
    // // fetch tenders of today based on this users category selection and format mail options accordingly
    // let tenders: Array<Tender> = await TenderModel.find({
    //     createdAt: { $gte: new Date(dates.startDate).toISOString(), $lt: new Date(dates.endDate).toISOString() },
    //     $and: [
    //         {...((account.alertRegions != null && account.alertRegions.length > 0) ? { region: {
    //             "$in": account.alertRegions
    //         } } : {})},
    //         {...((account.alertCategories != null && account.alertCategories.length > 0) ? { categories: {
    //             "$in": account.alertCategories
    //         } } : {})}  
    //     ]
    // })
    let tenderBody = '';
    let readCheckKey = Math.floor(Math.random() * 100000000);
    tenders.forEach((e) => {
        tenderBody += `<div class="row" style="margin-bottom: 10px">
           <div class="col-sm-12">
                <div class="tender-card card" style="position: relative;
                        display: -webkit-box;
                        display: -ms-flexbox;
                        display: flex;
                        -webkit-box-orient: vertical;
                        -webkit-box-direction: normal;
                        -ms-flex-direction: column;
                        flex-direction: column;
                        min-width: 0;
                        word-wrap: break-word;
                        background-color: #fff;
                        background-clip: border-box;
                        border: 1px solid rgba(0,0,0,.125);
                        border-radius: 0.25rem;
                        padding: 0px">
                    <div class="card-body" style=" -webkit-box-flex: 1;
                        -ms-flex: 1 1 auto;
                        flex: 1 1 auto;
                        padding: 0.25rem 1.25rem 0.25rem 1.25rem">
                        <h3 class="card-title text-primary" style="margin-bottom: 0.75rem;
                            display: block;
                            margin-block-start: 1em;
                            margin-block-end: 1em;
                            margin-inline-start: 0px;
                            margin-inline-end: 0px;"><a href="https://alphatenders.com/#/tenders/${e._id}" style="text-decoration: none;
                                color: #007bff!important;">
                            ${e.title}
                        </a></h3>
                        <hr style="border-color: rgba(0,0,0,.125);">
                        <p class="tender-card-sub-texts" style="color: #525354; font-size: 13px;"><strong>Opening Date:</strong> <span class="values" style="margin-left: 10px;"> ${new Date(e.bidOpeningDate).toLocaleDateString("en-US", statics_config_1.DATE_OPTIONS)} </span> </p>
                        <p class="tender-card-sub-texts" style="color: #525354; font-size: 13px;"><strong>Closing Date:</strong> <span class="values" style="margin-left: 10px;"> ${new Date(e.bidClosingDate).toLocaleDateString("en-US", statics_config_1.DATE_OPTIONS)} </span> </p>
                        <p class="tender-card-sub-texts" style="color: #525354; font-size: 13px;"><strong>Published On:</strong> <span class="values" style="margin-left: 10px;"> ${new Date(e.publicationDate).toLocaleDateString("en-US", statics_config_1.DATE_OPTIONS)} (${JSON.parse(JSON.stringify(e.tenderSources[0])).name.en})</span></p>
                    </div>
                </div>  
           </div>            
        </div> `;
    });
    var mailOptions = {
        from: '"Alpha Tenders" <alert@alphatenders.com>',
        to: account.email,
        subject: `Alpha Tenders ${dates.endDate} alert email`,
        html: `<html>
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
                
            <body style="background-color: #eff2f4;
                    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple   Color Emoji","Segoe UI Emoji","Segoe UI Symbol";">
                <div class="tender-body" style="margin-left: 12.5%;
                    width: 75%;
                    height: 100%;">
                    <hr>
                    <h4 class="text-center" style="text-align: center!important; color: #1c2e59">Alpha Tenders</h4>
                    <hr style="border-color: rgba(0,0,0,.125);">
                    <h2 class="text-center alert-title" style="text-align: center!important; color: #1c2e59">Tender Alert - ${new Date(dates.endDate).toLocaleDateString("en-US", statics_config_1.DATE_OPTIONS)}</h2>
                    <div class="alert alert-primary" style="color: #004085;
                        background-color: #cce5ff;
                        border-color: #b8daff;
                        font-size: 15px;
                        font-weight: 400;
                        position: relative;
                        padding: 0.75rem 1.25rem;
                        margin-bottom: 1rem;
                        border: 1px solid transparent;
                        border-radius: 0.25rem">
                        This is a summary of tenders posted on alphatenders.com on ${new Date(dates.endDate).toLocaleDateString("en-US", statics_config_1.DATE_OPTIONS)} which is selected based on your category and region selection.
                    </div>
                    ${tenders.length > 0 ? tenderBody : '<h5 class="text-center" style="text-align: center!important;">No Alert Tenders for your category today!</h5>'}           
                    <img src="https://api.alphatenders.com/api/v1/emailResults/openEmail?readCheckKey=${readCheckKey}" height="1" width="1" alt="t">
                </div>              
            </body>
        </html>`
    };
    return [mailOptions, tenders, readCheckKey];
});
exports.alertEmail = alertEmail;
const promoEmail = (email) => {
    let emailBody = '';
    emailBody =
        `<html>
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            
            <body style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;">
                <div style="margin-left: 12.5%;
                    width: 75%;
                    height: 100%;
                            padding: 15px 20px 15px 20px;
                    background-color: #eff2f4;">
                    <h3 style="text-align: center!important; color: #1c2e59"><img height="50" src="https://alphatenders.com/dist/img/logo-dark-small.png"> <p style="">Alpha Tenders</p></h3>
                    <hr style="border-color: rgba(0,0,0,.125);">
                <p style="font-size: 22px; text-align: center; font-weight: 600; color: #007bff">Get access to all tenders released in Ethiopia for just <span style="font-weight: 700">990 ETB</span> per yr.</p>
                <p style="font-size: 16px;">We cover tenders published on all news papers, on notice boards of companies and partner companies sending tenders directly to us. Access these tenders through <span style="color: #1c2e59; font-weight: 600">Mobile Application</span>, <span style="color: #1c2e59; font-weight: 600">Website</span> and <span style="color: #1c2e59; font-weight: 600">Telegram</span> and daily <span style="color: #1c2e59; font-weight: 600">Email Alert</span>.</p>
                <p style=""></p>
                <p style="font-size: 16px;">Call us on <a style="border-bottom: 1px solid #007bff; color: #007bff; text-decoration: none" href="tel:+251948016062">0948016062</a> / <a style="border-bottom: 1px solid #007bff; color: #007bff; text-decoration: none" href="tel:+251966245238">0966245238</a> for more information or to register. <a style="border-bottom: 1px solid #007bff; color: #007bff; text-decoration: none" href="https://www.alphatenders.com/#/signup">www.alphatenders.com</a></p>
                <br/>                    
                <div style="display: flex; justify-content: center;"><a href="https://play.google.com/store/apps/details?id=com.arppotechnologies.alphatenders" style="text-align: center!important; margin-right: 5px"><img height="70" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/800px-Google_Play_Store_badge_EN.svg.png"></a><a href="https://t.me/tenderFreeService" style=" margin-left: 5px"> <img height="75" src="https://alphatenders.com/dist/img/join-tg-channel-logo.png"></a>
                </div>
                <br/>
                <p style="text-align: center; color: #007bff; font-size: 10px;">2022 copyright &copy; <a href="https://alphatenders.com/" style="">alphatenders.com</a></p>
                <p style="text-align: center; font-size: 10px; color: #007bff">powered by <span class="company-name"><span class="name">arrpo</span><span style="color: #ee9d2c"> technologies</span></span>
                </div>
            <br/>
            </body>
        </html>`;
    var mailOptions = {
        from: 'Alpha Tenders <info@alphatenders.com>',
        to: email,
        subject: `Alpha Tenders | ጨረታ መረጃ አቅራቢዎች`,
        html: emailBody
    };
    return mailOptions;
};
exports.promoEmail = promoEmail;
