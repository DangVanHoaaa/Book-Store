import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../../utils'
import { favoriteModel, productModel } from '../../models'
import { favoriteConstant } from '../../constants'
import redis from '../../config/redis.config'


const getCacheKey = (userId: string) => `favorites:user:${userId}`


const toggleFavorite = async (userId: string, productId: string) => {

    const product = await productModel.findOne({ _id: productId, deleted: false })
    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại.')
    }


    const existingFavorite = await favoriteModel.findOne({ userId, productId })

    let isFavorite = false
    let message = ''

    if (existingFavorite) {

        await favoriteModel.findOneAndDelete({ userId, productId })
        isFavorite = false
        message = 'Đã bỏ sản phẩm khỏi danh sách yêu thích.'
    } else {

        const count = await favoriteModel.countDocuments({ userId })
        if (count >= favoriteConstant.FAVORITE_LIMITS.MAX_FAVORITES_PER_USER) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `Bạn chỉ được yêu thích tối đa ${favoriteConstant.FAVORITE_LIMITS.MAX_FAVORITES_PER_USER} sản phẩm.`
        )
        }

        await favoriteModel.create({ userId, productId })
        isFavorite = true
        message = 'Đã thêm sản phẩm vào danh sách yêu thích.'
    }

    const cacheKey = getCacheKey(userId)
    await redis.del(cacheKey)

    return {
        isFavorite,
        message
    }
}

const getFavorites = async (userId: string, query: any) => {
    const page = parseInt(query.page, 10) || 1
    const limit = parseInt(query.limit, 10) || 10
    const skip = (page - 1) * limit

    
    const favorites = await favoriteModel
        .find({ userId })
        .populate({
        path: 'productId',
        select: 'title slug images price status variants avgRating reviewCount format authors',
        populate: { path: 'authors', select: 'name slug' }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()

    const total = await favoriteModel.countDocuments({ userId })
    const totalPages = Math.ceil(total / limit) || 1

    return {
        favorites,
        pagination: {
        page,
        limit,
        total,
        totalPages
        }
    }
}

export default {
    toggleFavorite,
    getFavorites
}