export const notSubscribedAccountsFCM = (toodaysTendersCount: number) : string => {
    return `We have released ${toodaysTendersCount} tenders today. Start your subscription and get access to all tenders released in the country.`;
}

export const subscribedAccountsWithAlertFCM = (toodaysTendersCount: number, alertTendersCount: number) : string => {
    return `Out of ${toodaysTendersCount} tenders released today, ${alertTendersCount} tenders match your selection. You can open the app and follow up on the latest tenders.`;
}

export const subscribedAccountsWithNoAlertFCM = (toodaysTendersCount: number) : string => {
    return `We have released ${toodaysTendersCount} tenders today, you can open the app and read.`;
}