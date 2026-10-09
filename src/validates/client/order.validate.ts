import Joi from 'joi'
import customValidate from '../admin/custom.validate'
import { PAYMENT_METHOD } from '../../constants/order.constant'


const createOrder = {
    body: Joi.object().keys({
        addressId: Joi.string().required().custom(customValidate.objectId).messages({
        'any.required': 'Địa chỉ nhận hàng (addressId) là bắt buộc'
        }),
        paymentMethod: Joi.string().valid(...Object.values(PAYMENT_METHOD)).default(PAYMENT_METHOD.COD),
        note: Joi.string().allow('').trim().max(500)
    })
}

const getMyOrders = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(50).default(10),
        status: Joi.string().allow('').optional()
    })
}

const orderIdParam = {
    params: Joi.object().keys({
        id: Joi.string().required().custom(customValidate.objectId)
    })
}

export default {
    createOrder,
    getMyOrders,
    getOrderDetail: orderIdParam,
    cancelOrder: orderIdParam
}