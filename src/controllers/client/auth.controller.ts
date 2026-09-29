import { StatusCodes } from "http-status-codes";
import { response, catchAsync } from "../../utils";
import { authService, otpService } from "../../services";
import { Request, Response } from "express";

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

export default {
    sendOTP,
    verifyOTP,
    register
}