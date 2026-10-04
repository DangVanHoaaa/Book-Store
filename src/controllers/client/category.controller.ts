import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { CategoryService } from '../../services'
import { response, catchAsync } from '../../utils'

const getCategoryTree = catchAsync(async (req: Request, res: Response) => {
    const categoryTree = await CategoryService.getCategoryTree()

    res.status(StatusCodes.OK).json(
        response(StatusCodes.OK, 'Lấy danh sách danh mục thành công.', categoryTree)
    )
})

export default { getCategoryTree }