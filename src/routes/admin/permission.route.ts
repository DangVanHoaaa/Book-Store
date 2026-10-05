import { Router } from 'express'
import { adminPermissionController } from '../../controllers'
import validate from '../../middlewares/validate.middleware'
import { permissionValidate } from '../../validates'
import { authMiddleware } from '../../middlewares'

const router = Router()
router.use(authMiddleware.auth, authMiddleware.isAdmin)

router.get('/', validate(permissionValidate.getPermissions), adminPermissionController.getPermissions)
router.patch('/:id/toggle', adminPermissionController.toggleStatus)

export default router