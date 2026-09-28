import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { ApiError,catchAsync, jwt } from "../utils";
import { userModel } from "../models";
import { permissionConstant, roleConstant } from "../constants";
import { IUserAuth } from "../@types/express";

// auth - xac thuc Jwt
const auth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = jwt.extractToken(req) 
    if(!token)
    {
        throw new ApiError(StatusCodes.UNAUTHORIZED,'Token Không hợp lệ')
    }
    let payLoad: JwtPayload
    try {
        payLoad = jwt.verifyAccessToken(token)
    } catch (error: any) {
        if(error.name === 'TokenExpiredError')
        {
            throw new ApiError(StatusCodes.UNAUTHORIZED,'Token đã hết hạn')
        }
        throw new ApiError(StatusCodes.UNAUTHORIZED,'Token không hợp lệ')
    }

    const user = await userModel
    .findOne({_id:payLoad.userId})
    .select('-password')
    .populate({
        path: 'roleId',
        select: 'name slug isSystem',
        match: ({status: roleConstant.STATUS.ACTIVE }),
        populate: ({
            path: 'permissions',
            select: 'permissions',
            match: {status: permissionConstant.STATUS.ACTIVE}
        })
    })
    .lean<IUserAuth>()

    if(!user)
    {
        throw new ApiError(StatusCodes.NOT_FOUND,'Không tìm thấy người dùng')
    }
    req.user = user
    next()
})

// xac thuc admin
const isAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if(!req.user)
    {
        throw new ApiError(StatusCodes.UNAUTHORIZED,'Bạn cần đăng nhập')
    }
    let roleSlug: String | null = null
    if( req.user && req.user.roleId)
    {
        const role = req.user.roleId as any
        roleSlug = role
    }
    if(roleSlug === roleConstant.ROLE_SLUG.USER)
    {
        throw new ApiError(StatusCodes.FORBIDDEN,'Bạn không có quyền này truy cập trang quản trị')
    }
    next()
})
// xac thuc superadmin
const isSuperAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if(!req.user)
    {
        throw new ApiError(StatusCodes.UNAUTHORIZED,'Bạn cần đăng nhập')
    }
    let roleSlug: String | null = null
    if( req.user && req.user.roleId)
    {
        const role = req.user.roleId as any
        roleSlug = role
    }
    if(roleSlug !== roleConstant.ROLE_SLUG.SUPER_ADMIN)
    {
        throw new ApiError(StatusCodes.FORBIDDEN,'Bạn không có quyền này truy cập ')
    }
    next()

})

// xac thuc model_action
const authorize  = (module: string, action: string) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const requiredPermission  = `${module}_${action}`
        if(!req.user)
        {
        throw new ApiError(StatusCodes.UNAUTHORIZED,'Bạn cần đăng nhập')
        }
        const role = req.user.roleId as any
        if(role?.slug === roleConstant.ROLE_SLUG.SUPER_ADMIN)
        {
            return next()
        }
        const hasPermission = role?.permissions?.some((p: any) => p.code === requiredPermission)
        if(!hasPermission)
        {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền thực hiện hành động này.')
        }
        next
    })
}

export default { auth, isAdmin, isSuperAdmin, authorize }