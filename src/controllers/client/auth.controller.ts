import { StatusCodes } from "http-status-codes";
import { response, catchAsync } from "../../utils";
import { authService, otpService } from "../../services";
import { Request, Response } from "express";
import env from "../../config/env.config";

const sendOTP = catchAsync(async (req: Request, res: Response) => {
    const result = await otpService.sendOTP(req.body.email)
    return res.status(StatusCodes.OK).json(response(StatusCodes.OK, result.message))
})


const verifyOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body
    const result = await otpService.verifyOtp(email, otp)
    return res.status(StatusCodes.OK).json(response(StatusCodes.OK, result.message))
})

const register = catchAsync(async (req: Request, res: Response) =>{
    const  { user, accessToken, refreshToken } = await authService.createAccount(req.body)
    return res.status(StatusCodes.CREATED).json(
    response(StatusCodes.CREATED, 'Đăng ký tài khoản thành công!', {
      user,
      accessToken,
      refreshToken
    })
  )
})

// login 
const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const { userObj, accessToken, refreshToken} = await authService.login(email, password)

    res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Chống XSS (JS phía client không đọc được cookie này)
    secure: env.server.nodeEnv === 'production',
    sameSite: env.server.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 15 * 24 * 60 * 60 * 1000 // 15 ngày
  })

  return res.status(StatusCodes.OK).json(
    response(StatusCodes.OK,'Đăng nhập thành công', {userObj, accessToken})
  )
})

export default {
    sendOTP,
    verifyOTP,
    register,
    login
}