import { StatusCodes } from "http-status-codes";
import { response, catchAsync, ApiError } from "../../utils";
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
    httpOnly: true, 
    secure: env.server.nodeEnv === 'production',
    sameSite: env.server.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 15 * 24 * 60 * 60 * 1000 // 15 ngày
  })

  return res.status(StatusCodes.OK).json(
    response(StatusCodes.OK,'Đăng nhập thành công', {userObj, accessToken})
  )
})

//get me
const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  if(!user)
  {
    throw new ApiError(StatusCodes.NOT_FOUND,'Tài khoản không tồn tại ' )
  }
  return res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Lấy thông tin người dùng thành công.', { user })
  )
})

// refresh token
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken
  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(token)
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: env.server.nodeEnv === 'production',
    sameSite: env.server.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 15 * 24 * 60 * 60 * 1000
  })
  return res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Refresh token thành công!', { accessToken })
  )
})

const logout = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken
  if (token) {
    await authService.logout(token)
  }
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.server.nodeEnv === 'production',
    sameSite: env.server.nodeEnv === 'production' ? 'none' : 'lax'
  })
  return res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Đăng xuất thành công!')
  )
})
export default {
    sendOTP,
    verifyOTP,
    register,
    login,
    getMe,
    refreshToken,
    logout
}