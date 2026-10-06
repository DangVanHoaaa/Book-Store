import Joi from 'joi'
import customValidate from '../admin/custom.validate'
import { productConstant } from '../../constants'


const getProducts = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        key: Joi.string().allow('').trim().optional(),
        search: Joi.string().allow('').trim().optional(),
        keyword: Joi.string().allow('').trim().optional(),
        cursor: Joi.string().custom(customValidate.objectId).allow('').trim().optional(),
        categoryId: Joi.string().custom(customValidate.objectId).allow('').optional(),
        seriesId: Joi.string().custom(customValidate.objectId).allow('').optional(),
        authorId: Joi.string().custom(customValidate.objectId).allow('').optional(),
        minPrice: Joi.number().min(0).optional(),
        maxPrice: Joi.number().min(0).optional(),
        sortKey: Joi.string().valid('price', 'createdAt', 'sold', 'avgRating', 'title', '_id').default('_id'),
        sortValue: Joi.number().valid(1, -1).default(-1),
        status: Joi.string().valid(...Object.values(productConstant.STATUS)).allow('').optional()
    })
}


const getProductBySlug = {
    params: Joi.object({
        slug: Joi.string().required().trim().messages({
        'any.required': 'Slug sản phẩm là bắt buộc'
        })
    })
}

export default {
    getProducts,
    getProductBySlug
}