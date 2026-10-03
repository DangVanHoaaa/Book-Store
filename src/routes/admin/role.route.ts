import { Router } from 'express'
import { validate, authMiddleware } from '../../middlewares'
import { roleValidate } from '../../validates'
import { adminRoleController } from '../../controllers'

const router = Router()


router.use(authMiddleware.auth, authMiddleware.isSuperAdmin)
router.get('/', validate(roleValidate.getRoles),adminRoleController.getRoles)
router.post('/', validate(roleValidate.createRole), adminRoleController.createRole)
router.get('/:roleId', validate(roleValidate.checkId), adminRoleController.getRoleById)
router.put('/:roleId', validate(roleValidate.updateRole), adminRoleController.updateRole)
router.patch('/:roleId/permissions', validate(roleValidate.replaceRolePermissions), adminRoleController.replaceRolePermissions)
router.delete('/:roleId', validate(roleValidate.checkId), adminRoleController.deleteRole)

export default router