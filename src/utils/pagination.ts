import mongoose from 'mongoose'
import { MetaData, Pagination, paginationParams } from './types/type_constants'

export const paginationHandler = async({ queryPage: queryPage, queryLimit: queryLimit, query: query, Schema: Schema }: paginationParams) : Promise<MetaData> =>  {
    const page = parseInt(queryPage) || 1;
    const limit = parseInt(queryLimit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Schema.countDocuments(query);

    let pagination: Pagination = {
        next: {},
        prev: {}
    }

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    let metaData: MetaData;

    metaData =  {
        startIndex,
        limit,
        pagination,
        currentPage: page,
        total
    }

    return metaData;

}
