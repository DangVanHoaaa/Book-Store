import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../../utils'
import { addressModel } from '../../models'
import { ADDRESS_LIMITS } from '../../constants/address.constant'

const getAddresses = async (userId: string) => {
    const addresses = await addressModel
        .find({ userId })
        .sort({ isDefault: -1, createdAt: -1 })
        .lean()

    return addresses
}

const createAddress = async (userId: string, body: any) => {

    const count = await addressModel.countDocuments({ userId })
    if (count >= ADDRESS_LIMITS.MAX_ADDRESSES_PER_USER) {
        throw new ApiError(StatusCodes.BAD_REQUEST, `Bạn chỉ được lưu tối đa ${ADDRESS_LIMITS.MAX_ADDRESSES_PER_USER} địa chỉ.`)
    }

    if (count === 0) {
        body.isDefault = true
    }

    if (body.isDefault) {
        await addressModel.updateMany({ userId }, { isDefault: false })
    }

    const address = await addressModel.create({
        ...body,
        userId
    })

    return address
}

const updateAddress = async (userId: string, addressId: string, body: any) => {
    const address = await addressModel.findOne({ _id: addressId, userId })
    if (!address) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Địa chỉ không tồn tại hoặc không thuộc về bạn.')
    }

    if (body.isDefault && !address.isDefault) {
        await addressModel.updateMany({ userId, _id: { $ne: addressId } }, { isDefault: false })
    }

    Object.assign(address, body)
    await address.save()

    return address
}

const setDefaultAddress = async (userId: string, addressId: string) => {
    const address = await addressModel.findOne({ _id: addressId, userId })
    if (!address) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Địa chỉ không tồn tại.')
    }

    await addressModel.updateMany({ userId }, { isDefault: false })

    address.isDefault = true
    await address.save()

    return address
}

const deleteAddress = async (userId: string, addressId: string) => {
    const address = await addressModel.findOne({ _id: addressId, userId })
    if (!address) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Địa chỉ không tồn tại.')
    }

    const wasDefault = address.isDefault
    await addressModel.deleteOne({ _id: addressId, userId })

    if (wasDefault) {
        const remainingLatestAddress = await addressModel.findOne({ userId }).sort({ createdAt: -1 })
        if (remainingLatestAddress) {
        remainingLatestAddress.isDefault = true
        await remainingLatestAddress.save()
        }
    }

    return { message: 'Đã xóa địa chỉ thành công.' }
}

export default {
    getAddresses,
    createAddress,
    updateAddress,
    setDefaultAddress,
    deleteAddress
}