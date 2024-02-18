import mongoose from 'mongoose'
import { AlertCategoryBody, CountryBody, LanguageBody, RegionBody, SubscriptionBody, TenderSourceBody, TenderBody, AccountBody, BankBody, PaymentMethodBody, CurrencyBody, SubscriptionPlanBody, EmailResultBody, CompanyInfoBody, AdvertisementBody, CompanyBody, BookmarkedTenderBody, AdImpressionBody } from './method_return_dtos';

export const subscriptionBodyCast = (body: any) : SubscriptionBody => {
    console.log('subscriptionBody.paymentDate', new Date(parseInt(body.paymentDate)))

    let subscriptionBody : SubscriptionBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        ...(body.account != null ? { account: new mongoose.Types.ObjectId(body.account.toString()) } : {}),
        isPaid: body.isPaid,
        paymentMethod: new mongoose.Types.ObjectId(body.paymentMethod.toString()),
        currency: new mongoose.Types.ObjectId(body.currency.toString()),
        payment: body.payment ? new mongoose.Types.ObjectId(body.payment.toString()) : null,
        paymentDate: new Date(parseInt(body.paymentDate)),
        bank: new mongoose.Types.ObjectId(body.bank.toString()),
        invoiceId: body.invoiceId ? parseInt(body.invoiceId) : null,
        invoicePDF: body.invoicePDF ? body.invoicePDF.toString() : null,
        transactionRef: body.transactionRef.toString(),
        subscriptionPlan: new mongoose.Types.ObjectId(body.subscriptionPlan.toString()),
        startDate: new Date(parseInt(body.startDate)),
        endDate: body.endDate ? new Date(parseInt(body.endDate)) : null,
        createdBy: body.createdBy ? new mongoose.Types.ObjectId(body.createdBy.toString()) : null  
    }; 

    return subscriptionBody
}

export const alertCategoryBodyCast = (body: any) : AlertCategoryBody => { 
    let alertCategoryBody: AlertCategoryBody = {
        categories: body.categories.map((e: string) => new mongoose.Types.ObjectId(e))
    }

    return alertCategoryBody
}

export const languageBodyCast = (body: any) : LanguageBody => {
    let languageBody: LanguageBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        iso: body.iso,
        iso3: body.iso3,
        name: body.name,
        createdBy: new mongoose.Types.ObjectId
    }

    return languageBody
}

export const regionBodyCast = (body: any) : RegionBody => {
    let regionBody: RegionBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        name: body.name ? {
            en: body.name.en,
            am: body.name.am
        } : null,
        slug: '',
        country: new mongoose.Types.ObjectId(body.country),
        createdBy: new mongoose.Types.ObjectId
    }

    return regionBody
}

export const countryBodyCast = (body: any) : CountryBody => {
    let countryBody: CountryBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        name: body.name ? {
            en: body.name.en,
            am: body.name.am
        } : null,
        slug: '',
        createdBy: new mongoose.Types.ObjectId
    }

    return countryBody
}

export const tenderSourceBodyCast = (body: any) : TenderSourceBody => {
    let tenderSourceBodyBody: TenderSourceBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        name: body.name ? {
            en: body.name.en,
            am: body.name.am
        } : null,
        createdBy: new mongoose.Types.ObjectId
    }

    return tenderSourceBodyBody
}

export const tenderBodyCast = (body: any) : TenderBody => {
    let tenderSourceBodyBody: TenderBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        site_id: body.site_id,
        region: body.region ? new mongoose.Types.ObjectId(body.region) : null,
        language: body.language ? new mongoose.Types.ObjectId(body.language) : null,
        tenderSources: body.tenderSources?.map((e: string) => new mongoose.Types.ObjectId(e)),
        categories: body.categories?.map((e: string) => new mongoose.Types.ObjectId(e)),
        company: body.company ? new mongoose.Types.ObjectId(body.company) : null,
        bidBond: body.bidBond,
        bidOpeningDate: new Date(parseInt(body.bidOpeningDate)),
        bidClosingDate: new Date(parseInt(body.bidClosingDate)),
        isPublished: body.isPublished,
        isFeatured: body.isFeatured,
        isActive: body.isActive,
        isDeleted: body.isDeleted,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: new mongoose.Types.ObjectId,
        createdBy: new mongoose.Types.ObjectId
    }

    return tenderSourceBodyBody
}

export const accountBodyCast = (body: any) : AccountBody => {
    let accountBody: AccountBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        fname: body.fname,
        lname: body.lname,
        email: body.email,
        mobile: body.mobile,
        password: body.password,
        fcmToken: body.fcmToken,
        mobileDeviceInfo: body.mobileDeviceInfo,
        ...(body.roles != null ? { roles: body.roles} : {}),
        deviceInfo: body.deviceInfo,
        company: body.company ? new mongoose.Types.ObjectId(body?.company) : null,
        alertStatus: body.alertStatus,
        alertLanguages: body.alertLanguages?.map((e: string) => new mongoose.Types.ObjectId(e)),
        alertRegions: body.alertRegions?.map((e: string) => new mongoose.Types.ObjectId(e)),
        alertCategories: body.alertCategories?.map((e: string) => new mongoose.Types.ObjectId(e)),
        isActive: body.isActive,
        isDeleted: body.isDeleted,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: null,
        createdBy: null
    }
    return accountBody
}

export const bankBodyCast = (body: any) : BankBody => {
    let bankBody: BankBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        name: body.name,
        iso3: body.iso3,
        accountName: body.accountName,
        accountNumber: body.accountNumber,
        swiftCode: body.swiftCode,
        isActive: body.isActive,
        isDeleted: body.isDeleted,
        isUserViewable: body.isUserViewable,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: new mongoose.Types.ObjectId,
        createdBy: new mongoose.Types.ObjectId
    }

    return bankBody
}

export const paymentMethodBodyCast = (body: any) : PaymentMethodBody => {
    let paymentMethodBody: PaymentMethodBody = {
        _id: body._id ? new mongoose.Types.ObjectId(body._id) : null,
        name: body.name,
        isActive: body.isActive,
        isDeleted: body.isDeleted,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: new mongoose.Types.ObjectId,
        createdBy: new mongoose.Types.ObjectId
    }

    return paymentMethodBody
}

export const currencyBodyCast = (body: any) : CurrencyBody => {
    let currencyBody: CurrencyBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        name: body.name,
        iso3: body.iso3,
        isActive: body.isActive,
        isDeleted: body.isDeleted,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: new mongoose.Types.ObjectId,
        createdBy: new mongoose.Types.ObjectId
    }

    return currencyBody
}

export const subscriptionPlanBodyCast = (body: any) : SubscriptionPlanBody => {
    let subscriptionPlanBody: SubscriptionPlanBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        name: body.name,
        price: body.price,
        vat: body.vat,
        totalPrice: body.totalPrice,
        duration: body.duration,
        isUserSelectable: body.isUserSelectable,
        isActive: body.isActive,
        isDeleted: body.isDeleted,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: new mongoose.Types.ObjectId,
        createdBy: new mongoose.Types.ObjectId
    }

    return subscriptionPlanBody
}

export const emailResultBodyCast = (body: any) : EmailResultBody => {
    let emailResultBody: EmailResultBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        ...(body.account != null ? { account: new mongoose.Types.ObjectId(body.account.toString()) } : {}),
        tenders: body.tenders?.map((e: string) => new mongoose.Types.ObjectId(e)),
        sentToEmail: body.sentToEmail,
        type: body.type,
        isSent: body.isSent,
        isOpened: body.isOpened,
        readCheckKey: body.readCheckKey,
        openedAt: body.openedAt,
        isDeleted: body.isDeleted
    }

    return emailResultBody
}

export const companyInfoBodyCast = (body: any) : CompanyInfoBody => {
    let companyInfoBody: CompanyInfoBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        name: body.name,
        address: body.address,
        region: body.region != null ? new mongoose.Types.ObjectId(body.region) : null,
        country: body.country != null ? new mongoose.Types.ObjectId(body.country) : null,
        phone1: body.phone1,
        phone2: body.phone2,
        phone3: body.phone3,
        tin: body.tin,
        email: body.email,
        website: body.website,
        telegram: body.telegram,
        isActive: body.isActive,
        isDeleted: body.isDeleted
    }
    return companyInfoBody
}

export const companyBodyCast = (body: any) : CompanyBody => {
    let companyBody: CompanyBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        name: body.name,
        address: body.address,
        region: body.region != null ? new mongoose.Types.ObjectId(body.region) : null,
        country: body.country != null ? new mongoose.Types.ObjectId(body.country) : null,
        phone1: body.phone1,
        phone2: body.phone2,
        phone3: body.phone3,
        tin: body.tin,
        email: body.email,
        website: body.website,
        isActive: body.isActive,
        isDeleted: body.isDeleted
    }

    return companyBody
}

export const advertisementBodyCast = (body: any) : AdvertisementBody => {
    let advertisementBody: AdvertisementBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        bannerTitle: body.bannerTitle,
        bannerDescription: body.bannerDescription,
        hyperlink: body.hyperlink,
        bannerImage: body.bannerImage,
        themeColorHex: body.themeColorHex,
        company: new mongoose.Types.ObjectId(body.company.toString()),
        type: body.type,
        isActive: body.isActive,
        isDeleted: body.isDeleted,
        lastUpdatedAt: new Date(),
        lastUpdatedBy: new mongoose.Types.ObjectId,
        createdBy: new mongoose.Types.ObjectId
    }

    return advertisementBody
}

export const adImpressionBodyCast = (body: any) : AdImpressionBody => {
    let adImpressionBody: AdImpressionBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        type: body.type,
        advertisement: new mongoose.Types.ObjectId(body.advertisement.toString()),
        isActive: body.isActive,
        isDeleted: body.isDeleted,
        createdBy: new mongoose.Types.ObjectId
    }

    return adImpressionBody
}

export const bookmarkedTenderBodyCast = (body: any) : BookmarkedTenderBody => {
    let bookmarkedTenderBody: BookmarkedTenderBody = {
        ...(body._id != null ? { _id: new mongoose.Types.ObjectId(body._id.toString()) } : {}),
        account: body.account,
        tender: body.tender,
        isRemoved: body.isRemoved,
        isDeleted: body.isDeleted
    }

    return bookmarkedTenderBody
}