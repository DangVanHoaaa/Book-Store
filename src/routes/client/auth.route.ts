import { Router } from "express";
import { validate, authMiddleware } from "../../middlewares";
import { authValidate } from "../../validates";
import authController from "../../controllers/client/auth.controller";

const router = Router()
router.post('/send-otp',validate(authValidate.sendOtp),authController.sendOTP)
router.post('/verify',validate(authValidate.verifyOtp),authController.verifyOTP)
router.post('/register', validate(authValidate.register), authController.register)
router.post('/login', validate(authValidate.login), authController.login)

router.get('/me', authMiddleware.auth, authController.getMe)

router.post('/refresh-token', authController.refreshToken)
router.post('/logout', authController.logout)

export default router   