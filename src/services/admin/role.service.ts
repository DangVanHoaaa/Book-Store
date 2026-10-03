import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils";
import { permissionModel, roleModel } from "../../models";
import { permissionConstant, roleConstant } from "../../constants";
import { Types } from 'mongoose'
export interface IRoleInput {
  name: string
  description?: string
  status?: string
}

const getRoles = async (query: any) => {
  const limit = parseInt(query.limit || '10', 10)
  const cursor = query.cursor 

  const filter: any = {}

  if (cursor) {
    filter._id = { $lt: cursor }
  }

  if (query.status) {
    filter.status = query.status
  }

  const roles = await roleModel
    .find(filter)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .populate({
      path: 'permissions',
      match: { status: permissionConstant.STATUS.ACTIVE },
      select: 'code name module action'
    })
    .lean()

  let hasNextPage = false
  let nextCursor: string | null = null

  if (roles.length > limit) {
    hasNextPage = true
    roles.pop() 
  }

  if (roles.length > 0) {
    nextCursor = (roles[roles.length - 1] as any)._id.toString()
  }

  return {
    roles,
    pagination: {
      limit,
      hasNextPage,
      nextCursor
    }
  }
}

// get role by id
const getRoleById = async(roleId: string) =>{
  const role = await roleModel.findById({_id: roleId})
  if(!role)
  {
    throw new ApiError(StatusCodes.NOT_FOUND,'Vai trò này không tồn tại')
  }
  return role
}

// create role
const createRole = async (body: IRoleInput) => {
  const { name, description, status } = body
  const existedRole = await roleModel.findOne({ name: name.trim() })
  if (existedRole) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Vai trò này đã tồn tại.')
  }
  const newRole = await roleModel.create({
    name,
    description,
    status: status || roleConstant.STATUS.ACTIVE
  })
  return newRole
}

const updateRole = async (roleId: string, body: IRoleInput) => {
  const { name, description, status } = body
  const role = await roleModel.findById(roleId)
  if (!role) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Vai trò này không tồn tại.')
  }
  if (role.isSystem) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Không thể sửa vai trò hệ thống.')
  }
  const existedRole = await roleModel.findOne({
    _id: { $ne: roleId },
    name: name.trim()
  })
  if (existedRole) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Tên vai trò này đã bị trùng.')
  }
  role.name = name
  if (description !== undefined) role.description = description
  if (status) role.status = status as any
  await role.save()
  return role
}

const replaceRolePermissions = async (roleId: string, permissionIds: string[]) => {
  const role = await roleModel.findById(roleId)
  if (!role) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Vai trò này không tồn tại.')
  }
  if (role.isSystem) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Không thể sửa quyền của vai trò hệ thống.')
  }
  const uniquePermissionIds = [...new Set(permissionIds)]
  const count = await permissionModel.countDocuments({
    _id: { $in: uniquePermissionIds }
  })
  if (count !== uniquePermissionIds.length) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Danh sách quyền không hợp lệ hoặc chứa ID không tồn tại.')
  }
  role.permissions = uniquePermissionIds.map((id) => new Types.ObjectId(id)) as any
  await role.save()
  await role.populate({
    path: 'permissions',
    match: { status: permissionConstant.STATUS.ACTIVE },
    select: 'code name module action'
  })
  return role
}

const deleteRole = async (roleId: string) => {
  const role = await roleModel.findById(roleId)
  if (!role) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Vai trò này không tồn tại.')
  }
  if (role.isSystem) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Không thể xóa vai trò hệ thống.')
  }
  role.status = roleConstant.STATUS.INACTIVE as any
  await role.save()
  return true
}
export default {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  replaceRolePermissions,
  deleteRole
}