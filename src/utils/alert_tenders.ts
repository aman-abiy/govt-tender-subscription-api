import Account from '../interfaces/Account';
import Tender from '../interfaces/Tender';
import { TenderModel } from '../models/Tender_Model';
import { getStartEndDate } from './functions';
import TenderSource from '../interfaces/Tender_Source';

export const getAlertTenders = async(account: Account) : Promise<[Array<Tender>, number]> => {
    let dates = getStartEndDate()
    
    // fetch tenders of today based on this users category selection and format mail options accordingly
    let tenders: Array<Tender> = await TenderModel.find({
        createdAt: { $gte: new Date(dates.startDate).toISOString(), $lt: new Date(dates.endDate).toISOString() },
        $and: [
            {...((account.alertRegions != null && account.alertRegions.length > 0) ? { region: {
                "$in": account.alertRegions
            } } : {})},
            {...((account.alertCategories != null && account.alertCategories.length > 0) ? { categories: {
                "$in": account.alertCategories
            } } : {})}  
        ]
    }).populate<{ tenderSources: Array<TenderSource> }>('tenderSources')

    return [tenders, tenders.length]
}