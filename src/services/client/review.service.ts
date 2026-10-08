import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../../utils'
import { reviewModel, productModel } from '../../models'

const updateProductRating = async (productId: string) => {
    const stats = await reviewModel.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId) } },
        {
        $group: {
            _id: '$productId',
            avgRating: { $avg: '$rating' },
            reviewCount: { $sum: 1 }
        }
        }
    ])

    const avgRating = stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0
    const reviewCount = stats.length > 0 ? stats[0].reviewCount : 0

    await productModel.findByIdAndUpdate(productId, { avgRating, reviewCount })
}

const createReview = async (userId: string, body: any) => {
    const { productId, rating, content, images } = body

    const product = await productModel.findOne({ _id: productId, deleted: false })
    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại.')
    }

    const existingReview = await reviewModel.findOne({ userId, productId })
    if (existingReview) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Bạn đã viết đánh giá cho sản phẩm này rồi.')
    }


    const review = await reviewModel.create({
        userId,
        productId,
        rating,
        content,
        images
    })

    await updateProductRating(productId)

    return review
}

const getProductReviews = async (productId: string, query: any) => {
    const page = parseInt(query.page, 10) || 1
    const limit = parseInt(query.limit, 10) || 10
    const skip = (page - 1) * limit

    const reviews = await reviewModel
        .find({ productId })
        .populate('userId', 'fullname avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()

    const total = await reviewModel.countDocuments({ productId })
    const totalPages = Math.ceil(total / limit) || 1

    return {
        reviews,
        pagination: {
        page,
        limit,
        total,
        totalPages
        }
    }
}

const likeReview = async (userId: string, reviewId: string) => {
    const review = await reviewModel.findById(reviewId)
    if (!review) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Bài nhận xét không tồn tại.')
    }

    const userObjectId = new mongoose.Types.ObjectId(userId)
    const isLiked = review.likedBy?.some((id) => id.toString() === userId)

    if (isLiked) {

        review.likedBy = review.likedBy?.filter((id) => id.toString() !== userId)
    } else {

        if (!review.likedBy) review.likedBy = []
        review.likedBy.push(userObjectId)
    }

    await review.save()

    return {
        isLiked: !isLiked,
        likesCount: review.likedBy?.length || 0
    }
}

const deleteReview = async (userId: string, reviewId: string) => {
    const review = await reviewModel.findOne({ _id: reviewId, userId })
    if (!review) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Bài đánh giá không tồn tại hoặc không phải của bạn.')
    }

    const productId = review.productId.toString()
    await reviewModel.deleteOne({ _id: reviewId })

    await updateProductRating(productId)

    return { message: 'Đã xóa bài đánh giá thành công.' }
}

export default {
    createReview,
    getProductReviews,
    likeReview,
    deleteReview
}