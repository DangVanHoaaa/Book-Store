import { Router } from 'express'
import productController from '../../controllers/client/product.controller'
import { clientProductValidate } from '../../validates'
import { validate } from '../../middlewares'

const router = Router()

router.get('/', validate(clientProductValidate.getProducts), productController.getProducts)
router.get('/:slug', validate(clientProductValidate.getProductBySlug), productController.getProductBySlug)

export default router