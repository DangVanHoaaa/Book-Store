import { Request, Response } from 'express'
import { catchAsync, response } from '../../utils'
import bannerService from '../../services/admin/banner.service'
import { StatusCodes } from 'http-status-codes'


const getBanners = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await bannerService.getBanners(req.query)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách banner thành công', result))
})

const getBannerById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const bannerId  = req.params.bannerId as string
    const banner = await bannerService.getBannerById(bannerId)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy thông tin banner thành công', banner))
})


const createBanner = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const banner = await bannerService.createBanner(req.body)
    res.status(StatusCodes.CREATED).json(response(StatusCodes.CREATED, 'Tạo banner mới thành công', banner))
})


const updateBanner = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const bannerId  = req.params.bannerId as string
    const banner = await bannerService.updateBanner(bannerId, req.body)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Cập nhật banner thành công', banner))
})


const deleteBanner = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const bannerId  = req.params.bannerId as string
    await bannerService.deleteBanner(bannerId)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Xóa banner thành công'))
})

export default {
    getBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner
}