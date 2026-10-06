import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils";
import { seriesModel } from "../../models";
import { seriesConstant } from "../../constants";
import redis from "../../config/redis.config";


const SERIES_KEY = 'series'
export interface ISeriesInput {
  name: string
  description?: string
  coverImage?: string
  status?: string
}

// get all series
const getSeries = async(query: any) => {
    const limit = parseInt(query.limit, 10) || 10
    const cursor = query.cursor
    const keyword = query.keyword || query.key || query.search
    const status = query.status
    const filter: any = {}
    if(cursor){
        filter._id = {$lt: cursor}
    }

    if(keyword){
        filter.name = new RegExp(keyword, 'i')
    }
    if(status){
        filter.status = status
    }
    const seriesList = await seriesModel.find(filter).sort({_id: -1}).limit(limit+1).lean()
    let hasNextPage = false
    let nextCursor: string | null = null

    if(seriesList.length > limit){
        hasNextPage = true
        seriesList.pop()
    }
    if(seriesList.length > 0){
        nextCursor = (seriesList[seriesList.length - 1] as any)._id.toString()
    }
    return {
        series: seriesList,
        pagination: {
        limit,
        hasNextPage,
        nextCursor
        }
  }
}

//get series by id
const getSeriesById = async (seriesId: string) => {
    const series = await seriesModel.findById(seriesId)
    if(!series){
        throw new ApiError(StatusCodes.NOT_FOUND,'Bộ sách này không tồn tại')
    }
    return series
}
// create series
const createSeries = async(body: ISeriesInput) => {
    const {name, description, coverImage, status } = body
    const existedSeries = await seriesModel.findOne({name: name.trim()})
    if(existedSeries){
        throw new ApiError(StatusCodes.BAD_REQUEST,'Tên bộ sách này đã tồn tại')
    }
    const newSeries = await seriesModel.create({
        name,
        description,
        coverImage,
        status: status || seriesConstant.STATUS.ACTIVE
    })

    await redis.del(SERIES_KEY)
    return newSeries
}

const updateSeries = async(seriesId: string, body: ISeriesInput) => {
    const {name, description, coverImage, status } = body
    const series = await seriesModel.findById(seriesId)
    if(!series){
        throw new ApiError(StatusCodes.NOT_FOUND,'Bộ sách này không tồn tại')
    }

    const existedSeries = await seriesModel.findOne({
        _id: {$ne: seriesId},
        name: name.trim()
    })

    if(existedSeries){
        throw new ApiError(StatusCodes.BAD_REQUEST,'Tên bộ sách này đã bị trùng')
    }
    series.name = name
    if(description !== undefined) series.description = description
    if(coverImage !== undefined) series.coverImage = coverImage
    if(status !== undefined) series.status = status as any

    await series.save()

    await redis.del(SERIES_KEY)
    await redis.del(`series${series.slug}`)

    return series

}

const deleteSeries = async(seriesId: string) => {
    const series = await seriesModel.findById(seriesId)
    if(!series){
        throw new ApiError(StatusCodes.NOT_FOUND,'Bộ sách này không tồn tại')
    }

    series.status = seriesConstant.STATUS.INACTIVE as any
    await series.save()
    await redis.del(SERIES_KEY)
    await redis.del(`series${series.slug}`)
    return true
}
export default {
  getSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries

}