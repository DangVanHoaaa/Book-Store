import { StatusCodes } from "http-status-codes";
import { ApiError, jwt } from "../../utils";
import {  roleModel, userModel, tokenModel } from "../../models";
import { roleConstant, userConstant } from "../../constants";
import redis from "../../config/redis.config";

interface IregisterInput {
    email: string,
    password: string,
    fullname: string,
    phone?: string
}

// register
const createAccount = async (input: IregisterInput) => {
    const { email, password, fullname, phone} = input

    // kiem tra xac thuc
    const isVerified = await redis.get(`otp_verified:${email}`)
    if(!isVerified)
    {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'email chưa được xác thực')
    }

    // kiem tra email da tao tk chua
    const existingUser = await userModel.findOne({email})
    if(existingUser)
    {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'email đã tồn tại trên hệ thống')
    }

    // kiem tra co role user chưa
    const userRole = await roleModel.findOne({slug: roleConstant.ROLE_SLUG.USER})
    if(!userRole)
    {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Hệ thống chưa khởi tạo Role User mặc định.')
    }

    // tao user
    const user = await userModel.create({
        email,
        password,
        fullname,
        phone,
        roleId: userRole._id,
        status: userConstant.STATUS.ACTIVE,
        isVerified: true
    })

    await redis.del(`otp_verified:${email}`)

    const accessToken = jwt.generateAccessToken({userId: user._id})
    const refreshToken  = jwt.generateRefreshToken({userId: user._id})

    const expireAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    await tokenModel.create({
        userId: user._id,
        refreshToken,
        expireAt
    })

     const userObj = user.toObject()
    delete (userObj as any).password
    return { user: userObj, accessToken, refreshToken }
}

// login 
const login = async( email: string, passwordInput: string ) =>
{
    const user = await userModel.findOne({email}).select('+password')
    if(!user)
    {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email hoặc mật khẩu không chính xác.')
    }

    const isMatch = await user.isPasswordMatch(passwordInput)
    if(!isMatch)
    {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email hoặc mật khẩu không chính xác.')
    }
    if(user.status !== userConstant.STATUS.ACTIVE)
    {        
        throw new ApiError(StatusCodes.FORBIDDEN    , 'Tài khoản của bạn đã bi khóa.')
    }

    const accessToken = jwt.generateAccessToken({userId: user._id})
    const refreshToken  = jwt.generateRefreshToken({userId: user._id})

    const expireAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    await tokenModel.create({
        userId: user._id,
        refreshToken: refreshToken,
        expireAt: expireAt
    })
    const userObj = user.toObject()
    delete (userObj as any).password
    return {userObj, accessToken, refreshToken}
}

export default{
    createAccount,
    login
}