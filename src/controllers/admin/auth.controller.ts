import { catchAsync,response } from "../../utils";
import { Request, Response } from "express";
import { adminAuthService } from "../../services";
import { StatusCodes } from "http-status-codes";
import env from "../../config/env.config";

const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const { user, accessToken, refreshToken } = await adminAuthService.login(email, password)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.server.nodeEnv === 'production',
      sameSite: env.server.nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: 15 * 24 * 60 * 60 * 1000 // 15 ngày
    })
    return res.status(StatusCodes.OK).json(
      response(StatusCodes.OK, 'Đăng nhập Admin thành công!', {
        user,
        accessToken
      })
    )
  })

export default { login }