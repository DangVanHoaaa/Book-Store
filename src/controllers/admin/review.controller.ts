import { Request, Response } from 'express'
import { catchAsync, response } from '../../utils'
import { adminReviewService } from '../../services'
import { StatusCodes } from 'http-status-codes'

const getReviews = catchAsync(async (req: Request, res: Response) => {
    const result = await adminReviewService.getReviews(req.query)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách đánh giá thành công.', result))
})

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const reviewId = req.params.id as string
    const result = await adminReviewService.deleteReview(reviewId)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Xóa bài đánh giá vi phạm thành công.', result))
})

export default {
    getReviews,
    deleteReview
}