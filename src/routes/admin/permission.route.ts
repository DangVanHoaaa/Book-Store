import { Router } from 'express'
import { adminPermissionController } from '../../controllers'
import { permissionValidate } from '../../validates'
import { authMiddleware, validate } from '../../middlewares'

const router = Router()
router.use(authMiddleware.auth, authMiddleware.isAdmin)

router.get('/', validate(permissionValidate.getPermissions), adminPermissionController.getPermissions)
router.patch('/:id/toggle', adminPermissionController.toggleStatus)

export default router