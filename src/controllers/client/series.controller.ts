import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { seriesService } from "../../services";
import { catchAsync, ApiError, response } from "../../utils";

const getSeries = catchAsync(async(req: Request, res: Response) => {
    const series = await seriesService.getSeries(req.query)
    res.status(StatusCodes.OK).json(
        response(StatusCodes.OK, 'Lấy danh sách bộ sách thành công.', series)
  )
})

const getSeriesBySlug = catchAsync(async(req: Request, res: Response) => {
    const slug = req.params.slug as string
    const series = await seriesService.getSeriesBySlug(slug)
    if(!series){
        throw new ApiError(StatusCodes.NOT_FOUND,'Không tìm thấy bộ sách này')
    }
    res.status(StatusCodes.OK).json(
        response(StatusCodes.OK, 'Lấy thông tin bộ sách thành công.', series)
  )
})

export default {
    getSeries,
    getSeriesBySlug
}