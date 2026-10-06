import { Router } from 'express'
import { adminProductController } from '../../controllers'
import { productValidate } from '../../validates'
import { validate, authMiddleware } from '../../middlewares'

const router = Router()


router.use(authMiddleware.auth, authMiddleware.isAdmin)

router.get('/', validate(productValidate.getProducts), adminProductController.getProducts)
router.get('/:productId', validate(productValidate.checkId), adminProductController.getProductById)
router.post('/', validate(productValidate.createProduct), adminProductController.createProduct)
router.patch('/:productId', validate(productValidate.updateProduct), adminProductController.updateProduct)
router.delete('/:productId', validate(productValidate.checkId), adminProductController.deleteProduct)

export default router