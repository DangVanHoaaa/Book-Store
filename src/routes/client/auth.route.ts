import { Router } from "express";
import { validate } from "../../middlewares";
import { authValidate } from "../../validates";
import authController from "../../controllers/client/auth.controller";

const router = Router()
router.post('/send-otp',validate(authValidate.sendOtp),authController.sendOTP)
router.post('/verify',validate(authValidate.verifyOtp),authController.verifyOTP)
router.post('/register', validate(authValidate.register), authController.register)

export default router