import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { adminRoleService } from '../../services'
import { response, catchAsync } from '../../utils'

// get roles
const getRoles = catchAsync(async (req: Request, res: Response) => {
    const result = await adminRoleService.getRoles(req.query)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách Vai trò thành công.', result))
})

// get by id
const getRoleById = catchAsync(async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string
    const role = await adminRoleService.getRoleById(roleId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy Vai trò thành công.', role))
})

// create
const createRole = catchAsync(async (req: Request, res: Response) => {
    const newRole = await adminRoleService.createRole(req.body)

    res.status(StatusCodes.CREATED).json(response(StatusCodes.CREATED, 'Tạo Vai trò mới thành công.', newRole))
})

// update
const updateRole = catchAsync(async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string
    const updatedRole = await adminRoleService.updateRole(roleId, req.body)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Sửa Vai trò thành công.', updatedRole))
})


const replaceRolePermissions = catchAsync(async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string
    const { permissions } = req.body
    const role = await adminRoleService.replaceRolePermissions(roleId, permissions)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Cập nhật quyền cho vai trò thành công.', role))
})

// delete
const deleteRole = catchAsync(async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string 
    await adminRoleService.deleteRole(roleId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Xóa Vai trò thành công.'))
})

export default {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    replaceRolePermissions,
    deleteRole
}