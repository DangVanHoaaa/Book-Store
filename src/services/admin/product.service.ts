import { productModel } from "../../models";
import { ApiError } from "../../utils";
import { StatusCodes } from "http-status-codes";
import { productConstant } from "../../constants";
import redis from "../../config/redis.config";

const PRODUCT_KEY = 'products'

export interface IProductInput {
    title: string
    description?: string
    images: any[]
    authors: string[]
    publisher?: string
    publishingYear?: number
    categoryId?: string
    seriesId?: string
    variants?: any[]
    language?: string
    ISBN?: string
    page?: number
    format?: string
    quantity?: number
    price: number
    weight?: number
    status?: string
}

const getProducts = async (query: any) => {
    const limit = parseInt(query.limit, 10) || 10
    const cursor = query.cursor
    const keyword = query.keyword || query.key || query.search
    const { categoryId, seriesId, status } = query

    const filter: any = { deleted: false }

    if (cursor) {
        filter._id = { $lt: cursor }
    }

    if (keyword) {
        filter.title = { $regex: keyword.trim(), $options: 'i' }
    }

    if (categoryId) filter.categoryId = categoryId
    if (seriesId) filter.seriesId = seriesId
    if (status) filter.status = status

    const products = await productModel
        .find(filter)
        .populate('authors', 'name slug')
        .populate('categoryId', 'name slug')
        .populate('seriesId', 'name slug')
        .sort({ _id: -1 })
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

const getProductById = async (productId: string) => {
    const product = await productModel
        .findById(productId)
        .populate('authors', 'name slug')
        .populate('categoryId', 'name slug')
        .populate('seriesId', 'name slug')

    if (!product || product.deleted) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Cuốn sách này không tồn tại.')
    }
    return product
}

const createProduct = async (body: IProductInput) => {
    const existedProduct = await productModel.findOne({ title: body.title.trim(), deleted: false })
    if (existedProduct) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Tên cuốn sách này đã tồn tại.')
    }

    const newProduct = await productModel.create({
        ...body,
        status: body.status || productConstant.STATUS.AVAILABLE
    })

    await redis.del(PRODUCT_KEY)
    return newProduct
}

const updateProduct = async (productId: string, body: IProductInput) => {
    const product = await productModel.findById(productId)
    if (!product || product.deleted) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Cuốn sách này không tồn tại.')
    }

    if (body.title && body.title.trim() !== product.title) {
        const existedProduct = await productModel.findOne({
        _id: { $ne: productId },
        title: body.title.trim(),
        deleted: false
        })
        if (existedProduct) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Tên cuốn sách này đã bị trùng.')
        }
    }

    const updatedProduct = await productModel.findByIdAndUpdate(productId, body, { new: true })

    await redis.del(PRODUCT_KEY)
    await redis.del(`products:${product.slug}`)

    return updatedProduct
}

const deleteProduct = async (productId: string) => {
    const product = await productModel.findById(productId)
    if (!product || product.deleted) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Cuốn sách này không tồn tại.')
    }

    product.deleted = true
    await product.save()

    await redis.del(PRODUCT_KEY)
    await redis.del(`products:${product.slug}`)
    return true
}

export default {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}