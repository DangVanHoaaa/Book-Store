import { Router } from 'express'
import orderController from '../../controllers/client/order.controller'
import { orderValidate } from '../../validates'
import { validate, authMiddleware } from '../../middlewares'

const router = Router()

router.use(authMiddleware.auth)


router.get('/', validate(orderValidate.getMyOrders), orderController.getMyOrders)
router.post('/', validate(orderValidate.createOrder), orderController.createOrder)
router.get('/:id', validate(orderValidate.getOrderDetail), orderController.getOrderDetail)
router.patch('/:id/cancel', validate(orderValidate.cancelOrder), orderController.cancelOrder)

export default router