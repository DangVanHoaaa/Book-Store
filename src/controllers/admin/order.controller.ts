import { Request, Response } from 'express'
import { catchAsync, response } from '../../utils'
import { adminOrderService } from '../../services'
import { StatusCodes } from 'http-status-codes'

const getOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await adminOrderService.getOrders(req.query)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách đơn hàng admin thành công.', result))
})

const getOrderDetail = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id as string
    const result = await adminOrderService.getOrderDetail(orderId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy chi tiết đơn hàng admin thành công.', result))
})

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id as string
    const result = await adminOrderService.updateOrderStatus(orderId, req.body)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Cập nhật trạng thái đơn hàng thành công.', result))
})

export default {
    getOrders,
    getOrderDetail,
    updateOrderStatus
}