import { Request, Response } from 'express'
import { catchAsync, response } from '../../utils'
import bannerService from '../../services/client/banner.service'
import { StatusCodes } from 'http-status-codes'

const getBanners = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await bannerService.getBanners(req.query)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách banner thành công', result))
})

export default {
    getBanners
}