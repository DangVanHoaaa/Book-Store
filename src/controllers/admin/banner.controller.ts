import { Request, Response } from 'express'
import { catchAsync, response } from '../../utils'
import { adminBannerService } from '../../services'
import { StatusCodes } from 'http-status-codes'


const getBanners = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await adminBannerService.getBanners(req.query)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách banner thành công', result))
})

const getBannerById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const bannerId  = req.params.bannerId as string
    const banner = await adminBannerService.getBannerById(bannerId)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy thông tin banner thành công', banner))
})


const createBanner = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const banner = await adminBannerService.createBanner(req.body)
    res.status(StatusCodes.CREATED).json(response(StatusCodes.CREATED, 'Tạo banner mới thành công', banner))
})


const updateBanner = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const bannerId  = req.params.bannerId as string
    const banner = await adminBannerService.updateBanner(bannerId, req.body)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Cập nhật banner thành công', banner))
})


const deleteBanner = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const bannerId  = req.params.bannerId as string
    await adminBannerService.deleteBanner(bannerId)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Xóa banner thành công'))
})

export default {
    getBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner
}