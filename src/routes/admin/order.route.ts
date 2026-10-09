import { Router } from 'express'
import adminOrderController from '../../controllers/admin/order.controller'
import { authMiddleware } from '../../middlewares'

const router = Router()


router.use(authMiddleware.auth, authMiddleware.isAdmin)

router.get('/', adminOrderController.getOrders)
router.get('/:id', adminOrderController.getOrderDetail)
router.patch('/:id/status', adminOrderController.updateOrderStatus)

export default router