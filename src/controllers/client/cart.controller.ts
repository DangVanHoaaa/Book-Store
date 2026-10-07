import { Request, Response } from 'express'
import { catchAsync, response } from '../../utils'
import { cartService } from '../../services'
import { StatusCodes } from 'http-status-codes'


const getCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const cart = await cartService.getCart(userId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy giỏ hàng thành công.', cart))
})

const addToCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const cart = await cartService.addToCart(userId, req.body)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Thêm sản phẩm vào giỏ hàng thành công.', cart))
})

const updateCartItem = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const itemId = req.params.itemId as string
    const { quantity } = req.body
    const cart = await cartService.updateCartItem(userId, itemId, quantity)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Cập nhật số lượng thành công.', cart))
})

const removeCartItem = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const itemId = req.params.itemId as string
    const cart = await cartService.removeCartItem(userId, itemId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Xóa sản phẩm khỏi giỏ hàng thành công.', cart))
})

const clearCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const result = await cartService.clearCart(userId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Đã làm sạch giỏ hàng thành công.', result))
})

export default {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
}