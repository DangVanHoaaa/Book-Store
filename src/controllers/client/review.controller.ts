import { Request, Response } from 'express'
import { catchAsync, response } from '../../utils'
import { reviewService } from '../../services'
import { StatusCodes } from 'http-status-codes'

const createReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const review = await reviewService.createReview(userId, req.body)

    res.status(StatusCodes.CREATED).json(response(StatusCodes.CREATED, 'Viết bài đánh giá thành công.', review))
})

const getProductReviews = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId as string
    const result = await reviewService.getProductReviews(productId, req.query)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách đánh giá thành công.', result))
})

const likeReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const reviewId = req.params.id as string
    const result = await reviewService.likeReview(userId, reviewId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Cập nhật lượt thích thành công.', result))
})

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const reviewId = req.params.id as string
    const result = await reviewService.deleteReview(userId, reviewId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Xóa bài đánh giá thành công.', result))
})

export default {
    createReview,
    getProductReviews,
    likeReview,
    deleteReview
}