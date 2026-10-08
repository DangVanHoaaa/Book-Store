import Joi from 'joi'
import customValidate from '../admin/custom.validate'
import { REVIEW_LIMITS } from '../../constants/review.constant'

const createReview = {
    body: Joi.object().keys({
        productId: Joi.string().required().custom(customValidate.objectId).messages({
        'any.required': 'Mã sản phẩm (productId) là bắt buộc'
        }),
        rating: Joi.number().integer().min(REVIEW_LIMITS.MIN_RATING).max(REVIEW_LIMITS.MAX_RATING).required().messages({
        'any.required': 'Điểm đánh giá sao là bắt buộc',
        'number.min': `Điểm đánh giá tối thiểu là ${REVIEW_LIMITS.MIN_RATING} sao`,
        'number.max': `Điểm đánh giá tối đa là ${REVIEW_LIMITS.MAX_RATING} sao`
        }),
        content: Joi.string().required().trim().max(REVIEW_LIMITS.MAX_CONTENT_LENGTH).messages({
        'any.required': 'Nội dung nhận xét là bắt buộc',
        'string.empty': 'Nội dung nhận xét không được để trống',
        'string.max': `Nội dung nhận xét tối đa ${REVIEW_LIMITS.MAX_CONTENT_LENGTH} ký tự`
        }),
        images: Joi.array().items(
        Joi.object().keys({
            url: Joi.string().required(),
            publicId: Joi.string().allow('')
        })
        ).optional()
    })
}

const getProductReviews = {
    params: Joi.object().keys({
        productId: Joi.string().required().custom(customValidate.objectId)
    }),
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(50).default(10)
    })
}

const likeReview = {
    params: Joi.object().keys({
        id: Joi.string().required().custom(customValidate.objectId)
    })
}

const deleteReview = {
    params: Joi.object().keys({
        id: Joi.string().required().custom(customValidate.objectId)
    })
}

export default {
    createReview,
    getProductReviews,
    likeReview,
    deleteReview
}