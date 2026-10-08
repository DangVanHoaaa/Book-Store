import { Router } from 'express'
import { clientReviewController } from '../../controllers'
import { reviewValidate } from '../../validates'
import { validate, authMiddleware } from '../../middlewares'

const router = Router()

router.get('/:productId', validate(reviewValidate.getProductReviews), clientReviewController.getProductReviews)
router.post('/', authMiddleware.auth, validate(reviewValidate.createReview), clientReviewController.createReview)
router.post('/:id/like', authMiddleware.auth, validate(reviewValidate.likeReview), clientReviewController.likeReview)
router.delete('/:id', authMiddleware.auth, validate(reviewValidate.deleteReview), clientReviewController.deleteReview)

export default router