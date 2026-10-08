import { Request, Response } from 'express'
import { catchAsync, response } from '../../utils'
import { favoriteService } from '../../services'
import { StatusCodes } from 'http-status-codes'


const toggleFavorite = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const { productId } = req.body

    const result = await favoriteService.toggleFavorite(userId, productId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, result.message, result))
})

const getFavorites = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const result = await favoriteService.getFavorites(userId, req.query)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách yêu thích thành công.', result))
})

export default {
    toggleFavorite,
    getFavorites
}