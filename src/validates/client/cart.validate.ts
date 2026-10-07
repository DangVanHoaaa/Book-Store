import Joi from 'joi'
import customValidate from '../admin/custom.validate' 
import { CART_LIMITS } from '../../constants/cart.constant'


const addToCart = {
    body: Joi.object().keys({
        productId: Joi.string().required().custom(customValidate.objectId).messages({
        'any.required': 'Mã sản phẩm (productId) là bắt buộc',
        'string.empty': 'Mã sản phẩm không được để trống'
        }),
        variantOption: Joi.string().allow('', null).trim(), // Biến thể (VD: "Bìa Cứng"), có thể rỗng
        quantity: Joi.number().integer().min(1).max(CART_LIMITS.MAX_QUANTITY_PER_ITEM).default(1).messages({
        'number.min': 'Số lượng mua tối thiểu là 1',
        'number.max': `Số lượng mua tối đa cho mỗi sản phẩm là ${CART_LIMITS.MAX_QUANTITY_PER_ITEM}`
        })
    })
}


const updateCartItem = {
    params: Joi.object().keys({
        itemId: Joi.string().required().custom(customValidate.objectId)
    }),
    body: Joi.object().keys({
        quantity: Joi.number().integer().min(1).max(CART_LIMITS.MAX_QUANTITY_PER_ITEM).required().messages({
        'any.required': 'Số lượng là bắt buộc',
        'number.min': 'Số lượng mua tối thiểu là 1',
        'number.max': `Số lượng mua tối đa là ${CART_LIMITS.MAX_QUANTITY_PER_ITEM}`
        })
    })
}


const removeCartItem = {
    params: Joi.object().keys({
        itemId: Joi.string().required().custom(customValidate.objectId)
    })
}

export default {
    addToCart,
    updateCartItem,
    removeCartItem
}