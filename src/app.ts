import express, { Application } from 'express'
import path from 'path'
import dotenv from 'dotenv'
import xss from 'xss-clean'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'

import connectDB from './config/db.config'
import ErrorHandler from './utils/error_handler'
import ErrorResponse from './utils/error_response';

import authRoutes from './routes/auth'
import tenderRoutes from './routes/tender'
import subscriptionRoutes from './routes/subscription'
import alertRoutes from './routes/alert'
import languageRoutes from './routes/language'
import regionRoutes from './routes/region'
import countryRoutes from './routes/country'
import tenderSourceRoutes from './routes/tender_sources'
import categoryRoutes from './routes/category'
import accountRoutes from './routes/account'
import bookmarkedTenderRoutes from './routes/bookmarked_tender'
import bankRoutes from './routes/bank'
import currencyRoutes from './routes/currency'
import paymentRoutes from './routes/payment'
import paymentMethodRoutes from './routes/payment_method'
import subscriptionPlanRoutes from './routes/subscription_plan'
import emailResultRoutes from './routes/email_result'
import companyRoutes from './routes/company'
import companyInfoRoutes from './routes/company_info'
import commissionsRoutes from './routes/commission'
import statsRoutes from './routes/stats'
import advertisementRoutes from './routes/advertisement'
import adImpressionRoutes from './routes/ad_impressions'
import firebaseNotificationRoutes from './routes/firebase_notification'
import promoEmailRoutes from './routes/email_promo'

import backupRoutes from './routes/backup'
import { ADVERTISEMENT_DIR, INVOICE_DIR, TENDER_IMGS_DIR } from './config/statics.config';

// dotenv.config({ path: `${__dirname}/config/server.config.env` });
// dotenv.config({ path: `${__dirname}/config/keys.config.env` });
// dotenv.config({ path: `${__dirname}/config/scrapper.config.env` });
// dotenv.config({ path: `${__dirname}/config/dir.config.env` });
// dotenv.config({ path: './config/config.env' });

dotenv.config({ path: `${__dirname}/config/config.env` });

connectDB();

const app: Application = express();
app.use(express.json());

// security packages
app.use(xss())
app.use(helmet())
app.use(mongoSanitize())

// serving static files
app.use('/invoice', express.static(INVOICE_DIR))
app.use('/advertisements', express.static(ADVERTISEMENT_DIR))
app.use('/tender_imgs', express.static(TENDER_IMGS_DIR))

// handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(`/api/${process.env.VERSION}/auth`, authRoutes)
app.use(`/api/${process.env.VERSION}/tender`, tenderRoutes)
app.use(`/api/${process.env.VERSION}/subscription`, subscriptionRoutes)
app.use(`/api/${process.env.VERSION}/alert`, alertRoutes)
app.use(`/api/${process.env.VERSION}/language`, languageRoutes)
app.use(`/api/${process.env.VERSION}/region`, regionRoutes)
app.use(`/api/${process.env.VERSION}/country`, countryRoutes)
app.use(`/api/${process.env.VERSION}/tenderSource`, tenderSourceRoutes)
app.use(`/api/${process.env.VERSION}/category`, categoryRoutes)
app.use(`/api/${process.env.VERSION}/account`, accountRoutes)
app.use(`/api/${process.env.VERSION}/bookmarkTender`, bookmarkedTenderRoutes)
app.use(`/api/${process.env.VERSION}/bank`, bankRoutes)
app.use(`/api/${process.env.VERSION}/currency`, currencyRoutes)
app.use(`/api/${process.env.VERSION}/payment`, paymentRoutes)
app.use(`/api/${process.env.VERSION}/paymentMethod`, paymentMethodRoutes)
app.use(`/api/${process.env.VERSION}/subscriptionPlan`, subscriptionPlanRoutes)
app.use(`/api/${process.env.VERSION}/emailResults`, emailResultRoutes)
app.use(`/api/${process.env.VERSION}/company`, companyRoutes)
app.use(`/api/${process.env.VERSION}/companyInfo`, companyInfoRoutes)
app.use(`/api/${process.env.VERSION}/commissions`, commissionsRoutes)
app.use(`/api/${process.env.VERSION}/stats`, statsRoutes)
app.use(`/api/${process.env.VERSION}/advertisements`, advertisementRoutes)
app.use(`/api/${process.env.VERSION}/adImpressions`, adImpressionRoutes)
app.use(`/api/${process.env.VERSION}/firebase`, firebaseNotificationRoutes)
app.use(`/api/${process.env.VERSION}/promoEmail`, promoEmailRoutes)

app.use(`/api/${process.env.VERSION}/backup`, backupRoutes)


app.use((req, res, next) => {
    console.log('404 - req.url ', req.method, req.url)
    return next(new ErrorResponse(`404! Nothing Found! | url - '${req.url}' : method - '${req.method}'`, 404))
})

app.use(ErrorHandler)

app.listen(process.env.PORT || 8080);
