import { Request,Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminPermissionService } from "../../services"; 
import { catchAsync, response } from "../../utils";

const getPermissions = catchAsync(async( req: Request, res: Response) => {
    const result = await adminPermissionService.getPermissions(req.query)
    res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Lấy danh sách quyền thành công.', result)
  )
})


const toggleStatus = catchAsync(async(req: Request, res: Response) => {
    const { id } = req.params
    const permission = await adminPermissionService.toggleStatus(id as string)

    res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Cập nhật trạng thái quyền thành công.', permission)
  );
})
export default {getPermissions, toggleStatus}