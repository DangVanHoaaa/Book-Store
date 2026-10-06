import Joi from 'joi'
import customValidate from './custom.validate'
import { productConstant } from '../../constants'


const imageSchema = Joi.object({
    url: Joi.string().required().messages({
        'any.required': 'Đường dẫn ảnh là bắt buộc'
    }),
    publicId: Joi.string().allow('', null).optional()
})


const variantSchema = Joi.object({
    title: Joi.string().allow('', null).optional(),
    option: Joi.string().required().messages({
        'any.required': 'Tên tùy chọn biến thể là bắt buộc'
    }),
    quantity: Joi.number().integer().min(0).required().messages({
        'number.min': 'Số lượng không được nhỏ hơn 0',
        'any.required': 'Số lượng biến thể là bắt buộc'
    }),
    price: Joi.number().min(0).required().messages({
        'number.min': 'Giá tiền không được nhỏ hơn 0',
        'any.required': 'Giá biến thể là bắt buộc'
    }),
    image: imageSchema.optional()
})

const getProducts = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        key: Joi.string().allow('').trim().optional(),
        search: Joi.string().allow('').trim().optional(),
        cursor: Joi.string().custom(customValidate.objectId).allow('').trim().optional(),
        categoryId: Joi.string().custom(customValidate.objectId).allow('').optional(),
        seriesId: Joi.string().custom(customValidate.objectId).allow('').optional(),
        status: Joi.string().valid(...Object.values(productConstant.STATUS)).allow('').optional()
    })
}


const createProduct = {
    body: Joi.object({
        title: Joi.string().trim().min(2).max(300).required().messages({
        'string.empty': 'Tên sách không được để trống',
        'any.required': 'Tên sách là bắt buộc'
        }),
        description: Joi.string().trim().allow('', null).optional(),
        images: Joi.array().items(imageSchema).min(1).required().messages({
        'array.min': 'Phải có ít nhất 1 hình ảnh sản phẩm',
        'any.required': 'Danh sách ảnh là bắt buộc'
        }),
        authors: Joi.array().items(Joi.string().custom(customValidate.objectId)).min(1).required().messages({
        'array.min': 'Sách phải có ít nhất 1 tác giả',
        'any.required': 'Tác giả là bắt buộc'
        }),
        publisher: Joi.string().trim().allow('', null).optional(),
        publishingYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
        categoryId: Joi.string().custom(customValidate.objectId).allow('', null).optional(),
        seriesId: Joi.string().custom(customValidate.objectId).allow('', null).optional(),
        variants: Joi.array().items(variantSchema).optional(),
        language: Joi.string().trim().allow('', null).optional(),
        ISBN: Joi.string().trim().allow('', null).optional(),
        page: Joi.number().integer().min(1).optional(),
        format: Joi.string().trim().allow('', null).optional(),
        quantity: Joi.number().integer().min(0).default(0),
        price: Joi.number().min(0).required().messages({
        'number.min': 'Giá bán không được nhỏ hơn 0',
        'any.required': 'Giá bán là bắt buộc'
        }),
        weight: Joi.number().min(0).optional(),
        status: Joi.string().valid(...Object.values(productConstant.STATUS)).default(productConstant.STATUS.AVAILABLE)
    })
}


const updateProduct = {
    body: Joi.object({
        title: Joi.string().trim().min(2).max(300).optional(),
        description: Joi.string().trim().allow('', null).optional(),
        images: Joi.array().items(imageSchema).optional(),
        authors: Joi.array().items(Joi.string().custom(customValidate.objectId)).optional(),
        publisher: Joi.string().trim().allow('', null).optional(),
        publishingYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
        categoryId: Joi.string().custom(customValidate.objectId).allow('', null).optional(),
        seriesId: Joi.string().custom(customValidate.objectId).allow('', null).optional(),
        variants: Joi.array().items(variantSchema).optional(),
        language: Joi.string().trim().allow('', null).optional(),
        ISBN: Joi.string().trim().allow('', null).optional(),
        page: Joi.number().integer().min(1).optional(),
        format: Joi.string().trim().allow('', null).optional(),
        quantity: Joi.number().integer().min(0).optional(),
        price: Joi.number().min(0).optional(),
        weight: Joi.number().min(0).optional(),
        status: Joi.string().valid(...Object.values(productConstant.STATUS)).optional()
    }),
    params: Joi.object({
        productId: Joi.string().custom(customValidate.objectId).required()
    })
}

const checkId = {
    params: Joi.object({
        productId: Joi.string().custom(customValidate.objectId).required()
    })
}

export default {
    getProducts,
    createProduct,
    updateProduct,
    checkId
}