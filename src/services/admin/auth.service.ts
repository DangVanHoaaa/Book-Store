import { StatusCodes } from "http-status-codes";
import { ApiError, jwt } from "../../utils";
import { userConstant, roleConstant } from "../../constants";
import { tokenModel, userModel } from "../../models";

const login = async(email: string, passwordInput: string) => {
    const user = await userModel
    .findOne({ email })
    .select('+password')
    .populate({
        path: 'roleId',
        select: 'name slug isSystem',
        populate: {
        path: 'permissions',
        select: 'name code module action'
        }
    })
    if(!user)
    {
        throw new ApiError(StatusCodes.BAD_REQUEST,'Email hoặc mật khẩu không đúng')
    }

    const isMatch = await user.isPasswordMatch(passwordInput)
    if(!isMatch)
    {
        throw new ApiError(StatusCodes.BAD_REQUEST,'Email hoặc mật khẩu không đúng')       
    }

    if(user.status !== userConstant.STATUS.ACTIVE)
    {
        throw new ApiError(StatusCodes.FORBIDDEN,'Tài khoản của bạn đã bị khóa')       
    }

    const roleSlug = (user.roleId as any)?.slug
    if(roleSlug === roleConstant.ROLE_SLUG.USER)
    {
        throw new ApiError(StatusCodes.FORBIDDEN,'Bạn không có quyền truy cập trang admin')
    }

    const accessToken = jwt.generateAccessToken({userId: user._id})
    const refreshToken = jwt.generateRefreshToken({userId: user._id})

    const expireAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    await tokenModel.create({
        userId: user._id,
        refreshToken,
        expireAt
    })

    const userObj = user.toObject()
    delete (userObj as any).password

    return {user: userObj, accessToken, refreshToken}
}

export default {login}