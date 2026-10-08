import { Router } from 'express'
import adminReviewController from '../../controllers/admin/review.controller'
import { authMiddleware } from '../../middlewares'

const router = Router()

router.use(authMiddleware.auth, authMiddleware.isAdmin)
router.get('/', adminReviewController.getReviews)
router.delete('/:id', adminReviewController.deleteReview)

export default router