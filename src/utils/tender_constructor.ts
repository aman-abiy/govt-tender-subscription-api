import CTender from '../classes/Tender';

export const consturctTenderModel = (tenderJson: any) : CTender => {
    const tender = new CTender({
        site_id: tenderJson.id,
        title: tenderJson.title,
        description: tenderJson.description,
        language: CTender.toMongooseID(tenderJson.language.id),
        region: CTender.toMongooseID(tenderJson.region.id),
        categories: CTender.toMongooseIDArray(tenderJson.categories.map((e: any) => e.id)),
        tenderSources: CTender.toMongooseIDArray(tenderJson.tenderSources.map((e: any) => e.id)),
        bidBond: tenderJson.bidBond,
        bidOpeningDate: tenderJson.bidOpeningDate,
        bidOpeningDateText: tenderJson.bidOpeningDateText,
        bidClosingDate: tenderJson.bidClosingDate,
        bidClosingDateText: tenderJson.bidClosingDateText,
        publicationDate: tenderJson.tenderSources[0].publicationDate,
        isSaved: null,
        isPublished: tenderJson.isPublished,
        isFeatured: tenderJson.isFeatured,
        isActive: true,
        views: 0,
        isDeleted: true,
        createdBy: CTender.toMongooseID('6218c6437afaa15c03330f95'),
        createdAt: tenderJson.createdAt
    })

    // tender.castMongooseIds()
    return tender
}

