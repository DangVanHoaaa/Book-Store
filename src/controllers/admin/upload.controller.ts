import { Request, Response } from 'express'
import { catchAsync, response } from '../../utils'
import { StatusCodes } from 'http-status-codes'


const upload = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const images = req.body.uploadedImages
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Upload ảnh thành công.', images))
})

export default {
    upload
}