import Joi from 'joi'
import customValidate from '../admin/custom.validate'


const toggleFavorite = {
    body: Joi.object().keys({
        productId: Joi.string().required().custom(customValidate.objectId).messages({
        'any.required': 'Mã sản phẩm (productId) là bắt buộc'
        })
    })
}


const getFavorites = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(50).default(10)
    })
}

export default {
    toggleFavorite,
    getFavorites
}