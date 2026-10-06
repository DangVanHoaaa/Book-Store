import { productModel } from "../../models";
import { productConstant } from "../../constants";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils";
import redis from "../../config/redis.config";

const PRODUCT_KEY = 'products'

const getProducts = async (query: any) => {
    const limit = parseInt(query.limit, 10) || 10
    const cursor = query.cursor
    const keyword = query.keyword || query.key || query.search
    const { categoryId, seriesId, authorId, minPrice, maxPrice, sortKey = '_id', sortValue = -1 } = query

    const filter: any = {
        deleted: false,
        status: productConstant.STATUS.AVAILABLE
    }

    if (cursor) {
        filter._id = { $lt: cursor }
    }

    if (keyword) {
        filter.title = { $regex: keyword.trim(), $options: 'i' }
    }

    if (categoryId) filter.categoryId = categoryId
    if (seriesId) filter.seriesId = seriesId
    if (authorId) filter.authors = authorId

    if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {}
        if (minPrice !== undefined) filter.price.$gte = Number(minPrice)
        if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice)
    }

    const sortOptions: any = {}
    sortOptions[sortKey] = Number(sortValue)

    const products = await productModel
        .find(filter)
        .populate('authors', 'name slug avatar')
        .populate('categoryId', 'name slug')
        .populate('seriesId', 'name slug')
        .sort(sortOptions)
        .limit(limit + 1)
        .lean()

    let hasNextPage = false
    let nextCursor: string | null = null

    if (products.length > limit) {
        hasNextPage = true
        products.pop()
    }
    if (products.length > 0) {
        nextCursor = (products[products.length - 1] as any)._id.toString()
    }

    return {
        products,
        pagination: {
        limit,
        hasNextPage,
        nextCursor
        }
    }
}

const getProductBySlug = async (slug: string) => {
    const cacheKey = `products:${slug}`
    const cachedProduct = await redis.get(cacheKey)
    if (cachedProduct) {
        return JSON.parse(cachedProduct)
    }

    const product = await productModel
        .findOne({ slug, deleted: false, status: productConstant.STATUS.AVAILABLE })
        .populate('authors', 'name slug bio avatar')
        .populate('categoryId', 'name slug')
        .populate('seriesId', 'name slug')
        .lean()
    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Cuốn sách này không tồn tại.')
    }
        await redis.setex(cacheKey, 3600, JSON.stringify(product))
    return product
}

export default {
    getProducts,
    getProductBySlug
}