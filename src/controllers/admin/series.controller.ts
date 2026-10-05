import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { adminSeriesService } from '../../services'
import { response, catchAsync } from '../../utils'


const getSeries = catchAsync(async (req: Request, res: Response) => {
    const result = await adminSeriesService.getSeries(req.query)

    res.status(StatusCodes.OK).json(
        response(StatusCodes.OK, 'Lấy danh sách bộ sách thành công.', result)
    )
})


const getSeriesById = catchAsync(async (req: Request, res: Response) => {
    const  seriesId  = req.params.seriesId as string
    const seriesItem = await adminSeriesService.getSeriesById(seriesId)

    res.status(StatusCodes.OK).json(
        response(StatusCodes.OK, 'Lấy thông tin bộ sách thành công.', seriesItem)
    )
})


const createSeries = catchAsync(async (req: Request, res: Response) => {
    const newSeries = await adminSeriesService.createSeries(req.body)

    res.status(StatusCodes.CREATED).json(
        response(StatusCodes.CREATED, 'Tạo bộ sách mới thành công.', newSeries)
    )
})

const updateSeries = catchAsync(async (req: Request, res: Response) => {
    const  seriesId  = req.params.seriesId as string
    const updatedSeries = await adminSeriesService.updateSeries(seriesId, req.body)

    res.status(StatusCodes.OK).json(
        response(StatusCodes.OK, 'Cập nhật bộ sách thành công.', updatedSeries)
    )
})

const deleteSeries = catchAsync(async (req: Request, res: Response) => {
    const  seriesId  = req.params.seriesId as string
    await adminSeriesService.deleteSeries(seriesId)

    res.status(StatusCodes.OK).json(
        response(StatusCodes.OK, 'Xóa bộ sách thành công.')
    )
})

export default {
    getSeries,
    getSeriesById,
    createSeries,
    updateSeries,
    deleteSeries
}