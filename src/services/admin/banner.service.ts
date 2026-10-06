import { bannerModel, productModel } from "../../models";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils";
import { bannerConstant } from "../../constants";
import redis from "../../config/redis.config";

const BANNER_KEY = 'banners'

export interface IBannerInput {
    title: string
    description?: string
    image: string
    logo?: any
    thumbnail?: any
    imageUrl?: any
    linkType?: string
    linkValue?: string
    productId?: string
    displayOrder?: number
    status?: string
    startAt?: Date
    endAt?: Date
}


//get banners
const getBanners = async(query: any) => {
    const limit = parseInt(query.limit,10) || 10 
    const cursor = query.cursor
    const keyword = query.keyword || query.key || query.search
    const status = query.status

    const filter: any = {}
    if(cursor){
        filter._id = {$lt: cursor}
    }

    if(keyword){
        filter.title = { $regex: keyword.trim(), $options: 'i' }
    }

    if(status){
        filter.status = status
    }

    const banners = await bannerModel
        .find(filter)
        .populate('productId', 'title images slug')
        .sort({ displayOrder: 1, _id: -1 })
        .limit(limit + 1)
        .lean()

    let hasNextPage = false
    let nextCursor: string | null = null

    if(banners.length > limit){
        hasNextPage = true
        banners.pop()
    }

    if(banners.length > 0){
        nextCursor = (banners[banners.length - 1] as any)._id.toString()
    }
    return {
        banners,
        pagination: {
            limit,
            hasNextPage,
            nextCursor
        }
    }

}

//get banner by id
const getBannerById = async(bannerId: string) => {
    const banner = await bannerModel.findById(bannerId).populate('productId', 'title images slug')
    if(!banner){
        throw new ApiError(StatusCodes.NOT_FOUND,'Banner này không tồn tại')
    }
    return banner
}

//create banner
const createBanner = async(body: IBannerInput) => {
    const { title, description, image, logo, thumbnail, imageUrl, linkType, linkValue, productId, displayOrder, status, startAt, endAt } = body
    if(linkType === bannerConstant.LINKTYPE.PRODUCT){   
        if(!productId){
            throw new ApiError(StatusCodes.BAD_REQUEST,'Sản phẩm là bắt buộc khi chọn loại điều hướng sản phẩm')
        }
        const existedProduct = await productModel.findById(productId)
        if(!existedProduct){
            throw new ApiError(StatusCodes.NOT_FOUND,'Sản phẩm được liên kết không tồn tại')
        }
    }
    const newBanner = await bannerModel.create({
        title,
        description,
        image,
        logo,
        thumbnail,
        imageUrl,
        linkType: linkType || bannerConstant.LINKTYPE.URL,
        linkValue,
        productId,
        displayOrder: displayOrder || 1,
        status: status || bannerConstant.STATUS.ACTIVE,
        startAt,
        endAt
    })
    
    await redis.del(BANNER_KEY)
    return newBanner
}

const updateBanner = async (bannerId: string, body: IBannerInput) => {
    const { title, description, image, logo, thumbnail, imageUrl, linkType, linkValue, productId, displayOrder, status, startAt, endAt } = body
    const banner = await bannerModel.findById(bannerId)
    if (!banner) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Banner này không tồn tại.')
    }
    
    const currentLinkType = linkType || banner.linkType
    const currentProductId = productId || banner.productId
    if (currentLinkType === bannerConstant.LINKTYPE.PRODUCT) {
        if (!currentProductId) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Sản phẩm là bắt buộc khi chọn loại điều hướng là Sản phẩm.')
        }
        const existedProduct = await productModel.findById(currentProductId)
        if (!existedProduct) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm được liên kết không tồn tại.')
        }
    }
    if (title !== undefined) banner.title = title
    if (description !== undefined) banner.description = description
    if (image !== undefined) banner.image = image
    if (logo !== undefined) banner.logo = logo
    if (thumbnail !== undefined) banner.thumbnail = thumbnail
    if (imageUrl !== undefined) banner.imageUrl = imageUrl
    if (linkType !== undefined) banner.linkType = linkType as any
    if (linkValue !== undefined) banner.linkValue = linkValue
    if (productId !== undefined) banner.productId = productId as any
    if (displayOrder !== undefined) banner.displayOrder = displayOrder
    if (status) banner.status = status as any
    if (startAt !== undefined) banner.startAt = startAt
    if (endAt !== undefined) banner.endAt = endAt
    await banner.save()
    
    await redis.del(BANNER_KEY)
    await redis.del(`banners:${banner._id}`)
    return banner
}

const deleteBanner = async (bannerId: string) => {
    const banner = await bannerModel.findById(bannerId)
    if (!banner) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Banner này không tồn tại.')
    }
    await bannerModel.findByIdAndDelete(bannerId)
   
    await redis.del(BANNER_KEY)
    await redis.del(`banners:${banner._id}`)
    return true
}

export default {
    getBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner
}