import { bannerModel } from "../../models";
import { bannerConstant } from "../../constants";
import redis from "../../config/redis.config";

const BANNER_KEY = 'banners'

const getBanners = async( query: any) => {
    const limit = parseInt(query.limit, 10) || 10
    const cursor = query.cursor

    if(!cursor){
        const cachebanners = await redis.get(BANNER_KEY)
        if(cachebanners){
            return JSON.parse(cachebanners)
        }
    }

    const now = new Date()
    const filter: any = {
        status: bannerConstant.STATUS.ACTIVE,
        $or:  [
            { startAt: null, endAt: null },
            { startAt: { $exists: false } },
            { startAt: { $lte: now }, endAt: { $gte: now } },
            { startAt: { $lte: now }, endAt: null }
        ]
    }

    if(cursor){
        filter._id = {$lt: cursor}
    }

    const banners = await bannerModel 
        .find(filter)
        .populate('productId', 'title slug images')
        .sort({ displayOrder: 1, _id: -1 })
        .limit(limit + 1)
        .lean()

    let hasNextPage = false
    let nextCursor: string | null = null
    if(banners.length > limit){
        hasNextPage = true,
        banners.pop()
    }
    if (banners.length > 0) {
        nextCursor = (banners[banners.length - 1] as any)._id.toString()
    }

    const result = {
        banners,
        pagination: {
            limit,
            hasNextPage,
            nextCursor
        }
    }
    if (!cursor) {
        await redis.setex(BANNER_KEY, 3600, JSON.stringify(result))
    }
    return result
}

export default {
    getBanners
}