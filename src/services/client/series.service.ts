import { seriesModel } from "../../models";
import { seriesConstant } from "../../constants";
import redis from "../../config/redis.config";


const SERIES_KEY = 'series'

//get all series
const getSeries = async(query: any) => {
    const limit = parseInt(query.limit, 10) || 10;
    const cursor = query.cursor

    if(!cursor){
        const cachedSeries = await redis.get(SERIES_KEY)
        if(cachedSeries){
            return JSON.parse(cachedSeries)
        }
    }

    const filter: any = {status: seriesConstant.STATUS.ACTIVE}
    if(cursor){
        filter._id = { $lt: cursor}
    }

    const series = await seriesModel.find(filter).sort({_id: -1}).limit(limit+1).lean()

    let hasNextPage = false
    let nextCursor: string | null = null

    if(series.length > limit){
        hasNextPage = true
        series.pop()
    }
    if(series.length > 0){
        nextCursor = (series[series.length - 1] as any)._id.toString()
    }

    const result = {
        series: series,
        pagination: {
            limit,
            hasNextPage,
            nextCursor
        }
    }

    if(!cursor){
        await redis.setex(SERIES_KEY,3600,JSON.stringify(result))
    }
    return result
}

//get series by slug
const getSeriesBySlug = async(slug: string ) => {
    const cacheKey = `series${slug}`
    const cacheSeries = await redis.get(cacheKey)
    if(cacheSeries){
        return JSON.parse(cacheSeries)
    }
    const series = await seriesModel.findOne({slug, status: seriesConstant.STATUS.ACTIVE}).lean()
    if (series) {
    await redis.setex(cacheKey, 3600, JSON.stringify(series))

    return series
  }
}

export default {
    getSeries,
    getSeriesBySlug
}