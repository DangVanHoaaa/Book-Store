import { Router } from 'express'
import { validate } from '../../middlewares'
import { adminAuthValidate } from '../../validates'
import { adminAuthController } from '../../controllers'

const router = Router()

// Route Đăng nhập Admin
router.post('/login', validate(adminAuthValidate.login), adminAuthController.login)

export default router