import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import response from '../../utils/response'
import paymentService from '../../services/client/payment.service'

const createPaymentUrl = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id
    const { orderId } = req.body
    const ipAddr = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string

    const result = await paymentService.createPaymentUrl(userId, orderId, ipAddr)
    return response.success(res, StatusCodes.OK, 'Tạo URL thanh toán thành công', result)
})

const vnpayReturn = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentService.verifyReturnUrl(req.query)
    return response.success(res, StatusCodes.OK, 'Xác thực kết quả thanh toán thành công', result)
})

const vnpayIpn = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentService.processIpn(req.query)
    return res.status(StatusCodes.OK).json(result)
})

export default {
    createPaymentUrl,
    vnpayReturn,
    vnpayIpn
}