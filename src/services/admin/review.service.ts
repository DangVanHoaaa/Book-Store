import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../../utils'
import { reviewModel, productModel } from '../../models'

const getReviews = async (query: any) => {
    const page = parseInt(query.page, 10) || 1
    const limit = parseInt(query.limit, 10) || 10
    const skip = (page - 1) * limit

    const reviews = await reviewModel
        .find()
        .populate('userId', 'fullname email')
        .populate('productId', 'title slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()

    const total = await reviewModel.countDocuments()
    return { reviews, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
}


const deleteReview = async (reviewId: string) => {
    const review = await reviewModel.findByIdAndDelete(reviewId)
    if (!review) throw new ApiError(StatusCodes.NOT_FOUND, 'Bài nhận xét không tồn tại.')

    const stats = await reviewModel.aggregate([
        { $match: { productId: review.productId } },
        { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
    ])
    const avgRating = stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0
    const reviewCount = stats.length > 0 ? stats[0].reviewCount : 0
    await productModel.findByIdAndUpdate(review.productId, { avgRating, reviewCount })

    return { message: 'Đã xóa bài nhận xét vi phạm thành công.' }
}

export default { getReviews, deleteReview }