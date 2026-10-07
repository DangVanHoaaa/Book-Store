import { Router } from 'express'
import cartController from '../../controllers/client/cart.controller'
import { cartValidate } from '../../validates'
import { validate, authMiddleware } from '../../middlewares'

const router = Router()

router.use(authMiddleware.auth)


router.get('/', cartController.getCart)
router.post('/', validate(cartValidate.addToCart), cartController.addToCart)
router.patch('/:itemId', validate(cartValidate.updateCartItem), cartController.updateCartItem)
router.delete('/:itemId', validate(cartValidate.removeCartItem), cartController.removeCartItem)
router.delete('/', cartController.clearCart)

export default router