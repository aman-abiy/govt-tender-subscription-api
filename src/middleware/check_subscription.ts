import { Request, Response, NextFunction } from "express";
import Account from '../interfaces/Account';

const checkActiveSubscription = async(req: Request, res: Response, next: NextFunction) => {
    const user: Account = req.user

    if (!user.hasActiveSubscription) {
        // only fetch free tenders
        req.query.isFeatured = 'true'
    }
    next()
}

export default checkActiveSubscription