import { Request, Response } from 'express'
import { catchAsync, response } from '../../utils'
import { addressService } from '../../services'
import { StatusCodes } from 'http-status-codes'


const getAddresses = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const addresses = await addressService.getAddresses(userId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách địa chỉ thành công.', addresses))
})


const createAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const address = await addressService.createAddress(userId, req.body)

    res.status(StatusCodes.CREATED).json(response(StatusCodes.CREATED, 'Tạo địa chỉ nhận hàng thành công.', address))
})

const updateAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const addressId = req.params.id as string
    const address = await addressService.updateAddress(userId, addressId, req.body)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Cập nhật địa chỉ thành công.', address))
})

const setDefaultAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const addressId = req.params.id as string
    const address = await addressService.setDefaultAddress(userId, addressId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Đặt làm địa chỉ mặc định thành công.', address))
})

const deleteAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString()
    const addressId = req.params.id as string
    const result = await addressService.deleteAddress(userId, addressId)

    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Xóa địa chỉ thành công.', result))
})

export default {
    getAddresses,
    createAddress,
    updateAddress,
    setDefaultAddress,
    deleteAddress
}