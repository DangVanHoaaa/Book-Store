import { Request, Response } from 'express'
import { catchAsync, response } from '../../utils'
import { orderService } from '../../services'
import { StatusCodes } from 'http-status-codes'


const createOrder = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const result = await orderService.createOrder(userId, req.body)

    res.status(StatusCodes.CREATED).json(response(StatusCodes.CREATED, 'Tạo đơn hàng thành công.', result))
})

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const result = await orderService.getMyOrders(userId, req.query)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách đơn hàng thành công.', result))
})

const getOrderDetail = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const orderId = req.params.id as string

    const result = await orderService.getOrderDetail(userId, orderId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy chi tiết đơn hàng thành công.', result))
})

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const orderId = req.params.id as string

    const result = await orderService.cancelOrder(userId, orderId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Hủy đơn hàng thành công.', result))
})

export default {
    createOrder,
    getMyOrders,
    getOrderDetail,
    cancelOrder
}