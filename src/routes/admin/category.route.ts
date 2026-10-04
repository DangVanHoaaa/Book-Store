import { Router } from 'express'
import { validate, authMiddleware } from '../../middlewares'
import { categoryValidate } from '../../validates'
import { adminCategoryController } from '../../controllers'
const router = Router()
router.use(authMiddleware.auth, authMiddleware.isAdmin)


router.get('/', adminCategoryController.getCategoryTree)
router.post('/', validate(categoryValidate.createCategory), adminCategoryController.createCategory)
router.get('/:categoryId', validate(categoryValidate.checkId), adminCategoryController.getCategoryById)
router.put('/:categoryId', validate(categoryValidate.updateCategory), adminCategoryController.updateCategory)
router.delete('/:categoryId', validate(categoryValidate.checkId), adminCategoryController.deleteCategory)

export default router