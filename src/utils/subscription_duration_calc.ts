import mongoose from "mongoose";
import SubscriptionPlan from '../interfaces/Subscription_Plan'
import { SubscriptionPlanModel } from '../models/Subscription_Plan_Model';
import { SubscriptionDates } from './types/type_constants';

export const calculateSubscriptionEndDate = (subscriptionPlan: SubscriptionPlan, startDate: Date) : SubscriptionDates => {
    let endDate: Date

    // set startDate to beginning(00:00) of subscription date
    startDate = new Date(new Date(startDate.getTime()).setUTCHours(0, 1, 0, 0))
    endDate = new Date(new Date(startDate.getTime() + subscriptionPlan.duration).setUTCHours(23, 59, 0, 0))

    return {
        startDate,
        endDate
    }
    
}