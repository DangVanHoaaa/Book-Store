import { Router } from 'express'
import { adminPermissionController } from '../../controllers'
import validate from '../../middlewares/validate.middleware'
import { permissionValidate } from '../../validates'
import { authMiddleware } from '../../middlewares'

const router = Router()


router.get('/', authMiddleware.auth, authMiddleware.isSuperAdmin, validate(permissionValidate.getPermissions), adminPermissionController.getPermissions)

router.patch('/:id/toggle', authMiddleware.auth, authMiddleware.isSuperAdmin, adminPermissionController.toggleStatus)

export default router