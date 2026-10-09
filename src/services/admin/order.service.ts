import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../../utils'
import { orderModel, orderItemModel, productModel } from '../../models'
import { orderConstant } from '../../constants'


const getOrders = async (query: any) => {
    const limit = parseInt(query.limit, 10) || 10
    const cursor = query.cursor 
    const { status, paymentStatus, orderCode, search } = query

    const filter: any = {}

    if (status) filter.orderStatus = status
    if (paymentStatus) filter.paymentStatus = paymentStatus
    if (orderCode) filter.orderCode = { $regex: orderCode.trim(), $options: 'i' }

    if (search) {
        filter.$or = [
        { orderCode: { $regex: search.trim(), $options: 'i' } },
        { 'shippingInfo.fullname': { $regex: search.trim(), $options: 'i' } },
        { 'shippingInfo.phone': { $regex: search.trim(), $options: 'i' } }
        ]
    }

    if (cursor) {
        filter._id = { $lt: cursor }
    }

    const orders = await orderModel
        .find(filter)
        .populate('userId', 'fullname email phone')
        .sort({ _id: -1 })
        .limit(limit + 1)
        .lean()

    let hasNextPage = false
    let nextCursor: string | null = null

    if (orders.length > limit) {
        hasNextPage = true
        orders.pop() 
    }

    if (orders.length > 0) {
        nextCursor = (orders[orders.length - 1] as any)._id.toString()
    }

    return {
        orders,
        pagination: {
        limit,
        hasNextPage,
        nextCursor
        }
    }
}

const getOrderDetail = async (orderId: string) => {
    const order = await orderModel
        .findById(orderId)
        .populate('userId', 'fullname email phone')
        .lean()

    if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Đơn hàng không tồn tại.')
    }

    const items = await orderItemModel.find({ orderId: order._id }).lean()

    return {
        order,
        items
    }
}

const updateOrderStatus = async (orderId: string, body: { orderStatus: string; paymentStatus?: string }) => {
    const { orderStatus, paymentStatus } = body

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const order = await orderModel.findById(orderId).session(session)
        if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Đơn hàng không tồn tại.')
        }

        const oldStatus = order.orderStatus

        if (orderStatus === orderConstant.ORDER_STATUS.CANCELLED && oldStatus !== orderConstant.ORDER_STATUS.CANCELLED) {
        const orderItems = await orderItemModel.find({ orderId: order._id }).session(session)
        for (const item of orderItems) {
            await productModel.findByIdAndUpdate(
            item.productId,
            { $inc: { quantity: item.quantity, sold: -item.quantity } },
            { session }
            )
        }
        }

        if (orderStatus === orderConstant.ORDER_STATUS.DELIVERED) {
        order.paymentStatus = orderConstant.PAYMENT_STATUS.PAID
        } else if (paymentStatus) {
        order.paymentStatus = paymentStatus
        }

        order.orderStatus = orderStatus
        await order.save({ session })

        await session.commitTransaction()
        session.endSession()

        return order
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

export default {
    getOrders,
    getOrderDetail,
    updateOrderStatus
}