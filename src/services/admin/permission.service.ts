import { ApiError } from "../../utils";
import { StatusCodes } from "http-status-codes";
import { permissionModel } from "../../models";
import { permissionConstant } from "../../constants";

export

const getPermissions = async (query: any) => {
  const limit = parseInt(query.limit || '10', 10)
  const cursor = query.cursor 

  const filter: any = {}

  if (cursor) {
    filter._id = { $lt: cursor }
  }

  if (query.keyword) {
    filter.$or = [
      { name: new RegExp(query.keyword, 'i') },
      { code: new RegExp(query.keyword, 'i') }
    ]
  }

  if (query.module) {
    filter.module = query.module
  }

  if (query.status) {
    filter.status = query.status
  }

  const permissions = await permissionModel
    .find(filter)
    .sort({ _id: -1 })   
    .limit(limit + 1)    
    .lean()

  let hasNextPage = false
  let nextCursor: string | null = null

  if (permissions.length > limit) {
    hasNextPage = true
    permissions.pop() 
  }

  if (permissions.length > 0) {
    nextCursor = (permissions[permissions.length - 1] as any)._id.toString()
  }

  return {
    permissions,
    pagination: {
      limit,
      hasNextPage,
      nextCursor
    }
  }
}

const toggleStatus = async(id: string) => {
    const permission = await permissionModel.findById(id)

    if(!permission)
    {
        throw new ApiError(StatusCodes.NOT_FOUND,'Không tìm thấy quyền hạn này')
    }

    if( permission.status === permissionConstant.STATUS.ACTIVE)
    {
        permission.status = permissionConstant.STATUS.INACTIVE
    }
    else{
        permission.status = permissionConstant.STATUS.ACTIVE
    }
    await permission.save()
    return permission
}
export default {getPermissions, toggleStatus}