import { Router } from 'express'
import paymentController from '../../controllers/client/payment.controller'
import { authMiddleware } from '../../middlewares'

const router = Router()

router.post('/create-vnpay-url', authMiddleware.auth, paymentController.createPaymentUrl)
router.get('/vnpay-return', paymentController.vnpayReturn)
router.get('/vnpay-ipn', paymentController.vnpayIpn)

export default router