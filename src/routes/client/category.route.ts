import { Router } from 'express'
import { clientCategoryController } from '../../controllers'

const router = Router()

router.get('/', clientCategoryController.getCategoryTree)

export default router