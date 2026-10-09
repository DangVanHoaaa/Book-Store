import crypto, { privateDecrypt } from 'crypto'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../../utils'
import { orderModel, orderItemModel, cartModel, cartItemModel, addressModel, productModel } from '../../models'
import { orderConstant } from '../../constants'

const generateOrderCode = (): string => {
  const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase()
  return `HD-${randomHex}`
}

const createOrder = async(userId: string, body: {addressId: string; paymentMethod?: string; note?: string}) => {
    const { addressId, paymentMethod = orderConstant.PAYMENT_METHOD.COD, note = ''} = body

    const address  = await addressModel.findOne({_id: addressId, userId})
    if(!address){
        throw new ApiError(StatusCodes.NOT_FOUND,'Địa chỉ nhận hàng không tồn tại')
    }

    const cart = await cartItemModel.findOne({userId})
    if(!cart){
        throw new ApiError(StatusCodes.BAD_REQUEST,'Giỏ hàng của bạn đang trống')
    }

    const cartItems = await cartItemModel.find({cartId: cart._id}).populate('productId')
    if(!cartItems || cartItems.length === 0){
        throw new ApiError(StatusCodes.BAD_REQUEST,'Giỏ hàng của bạn đang trống')
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        let totalPrice = 0
        const orderItemsData: any[] = []

        for(const item of cartItems){
            const product: any = item.productId
            if(!product || product.deleted){
                throw new ApiError(StatusCodes.BAD_REQUEST,`Sản phẩm "${item.productId}" không còn tồn tại.`)
            } 

            const updatedProduct = await productModel.findOneAndUpdate(
                {
                    _id: product._id,
                    deleted: false,
                    quantity: { $gte: item.quantity}
                },
                {
                    $inc: {quantity: -item.quantity, sold: item.quantity}
                },
                {session, new: true}
            )
            if( !updatedProduct){
                throw new ApiError(StatusCodes.BAD_REQUEST,`Sản phẩm "${product.title}" đã hết hàng hoặc số lượng trong kho không đủ.`)
            }

            const itemTotalPrice = item.price * item.quantity
            totalPrice += itemTotalPrice

            orderItemsData.push({
                productId: product._id,
                productTitle: product.title,
                productImage: product.images?.[0]?.url || '',
                variantOption: item.variantOption || '',
                quantity: item.quantity,
                price: item.price,
                totaPrice: itemTotalPrice
            })
        }

        const shippingFee = 30000
        const finalPrice = totalPrice + shippingFee
        const orderCode = generateOrderCode()

        const [order] = await orderModel.create(
        [
            {
            orderCode,
            userId,
            shippingInfo: {
                fullname: address.fullname,
                phone: address.phone,
                provinceName: address.provinceName,
                districtName: address.districtName,
                wardName: address.wardName,
                detail: address.detail
            },
            paymentMethod,
            paymentStatus: orderConstant.PAYMENT_STATUS.UNPAID,
            orderStatus: orderConstant.ORDER_STATUS.AWAITING_CONFIRMATION,
            totalPrice,
            shippingFee,
            finalPrice,
            note
            }
        ],
        { session }
        )
        const finalOrderItems = orderItemsData.map((item) => ({
            ...item,
            orderId: order._id
        }))
        await orderItemModel.insertMany(finalOrderItems, { session })

        await cartItemModel.deleteMany({ cartId: cart._id }, { session })
        await session.commitTransaction()
        session.endSession()
        return {
            order,
            items: finalOrderItems
        }
    }
    catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
  }
}

const getMyOrders = async (userId: string, query: any) => {
    const limit = parseInt(query.limit, 10) || 10
    const cursor = query.cursor 
    const { status } = query

    const filter: any = { userId }

    if (status) {
        filter.orderStatus = status
    }

    if (cursor) {
        filter._id = { $lt: cursor }
    }

    const orders = await orderModel
        .find(filter)
        .sort({ _id: -1 })  
        .limit(limit + 1)   
        .lean()

    let hasNextPage = false
    let nextCursor: string | null = null

    if (orders.length > limit) {
        hasNextPage = true
        orders.pop() // Bỏ phần tử dư thứ (limit + 1)
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


const getOrderDetail = async (userId: string, orderId: string) => {
    const order = await orderModel.findOne({ _id: orderId, userId }).lean()
    if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Đơn hàng không tồn tại.')
    }
    const items = await orderItemModel.find({ orderId: order._id }).lean()
    return {
        order,
        items
    }
}

const cancelOrder = async (userId: string, orderId: string) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const order = await orderModel.findOne({ _id: orderId, userId }).session(session)
        if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Đơn hàng không tồn tại.')
        }
        if (order.orderStatus !== orderConstant.ORDER_STATUS.AWAITING_CONFIRMATION) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Đơn hàng đã được xử lý hoặc đang giao, không thể hủy.'
        )
        }
        order.orderStatus = orderConstant.ORDER_STATUS.CANCELLED
        await order.save({ session })
        const orderItems = await orderItemModel.find({ orderId: order._id }).session(session)
        for (const item of orderItems) {
        await productModel.findByIdAndUpdate(
            item.productId,
            { $inc: { quantity: item.quantity, sold: -item.quantity } },
            { session }
        )
        }
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
    createOrder,
    getMyOrders,
    getOrderDetail,
    cancelOrder
}

