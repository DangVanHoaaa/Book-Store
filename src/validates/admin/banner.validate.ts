import Joi from 'joi'
import customValidate from './custom.validate'
import { bannerConstant } from '../../constants'

const getBanners = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        key: Joi.string().allow('').trim().optional(), 
        search: Joi.string().allow('').trim().optional(),
        status: Joi.string().valid(...Object.values(bannerConstant.STATUS)).allow('').optional()
    })
}

const createBanner = {
    body: Joi.object({
        title: Joi.string().trim().min(3).max(200).required().messages({
            'string.empty': 'Tiêu đề không được để trống',
            'any.required': 'Tiêu đề là bắt buộc'
        }),
        description: Joi.string().trim().allow('', null).optional(),
        // 👉 SỬA DÒNG NÀY THÀNH image
        image: Joi.string().trim().required().messages({
            'string.empty': 'Ảnh banner không được để trống',
            'any.required': 'Ảnh banner là bắt buộc'
        }),
        linkType: Joi.string().valid(...Object.values(bannerConstant.LINKTYPE)).default(bannerConstant.LINKTYPE.URL),
        linkValue: Joi.string().allow('', null).optional(),
        productId: Joi.string().custom(customValidate.objectId).allow('', null).optional(),
        displayOrder: Joi.number().integer().min(1).optional(),
        status: Joi.string().valid(...Object.values(bannerConstant.STATUS)).default(bannerConstant.STATUS.ACTIVE),
        startAt: Joi.date().allow(null).optional(),
        endAt: Joi.date().allow(null).optional()
    })
}

const updateBanner = {
    body: Joi.object({
        title: Joi.string().trim().min(3).max(200).optional(),
        description: Joi.string().trim().allow('', null).optional(),
        // 👉 SỬA DÒNG NÀY THÀNH image
        image: Joi.string().trim().optional(),
        linkType: Joi.string().valid(...Object.values(bannerConstant.LINKTYPE)).optional(),
        linkValue: Joi.string().allow('', null).optional(),
        productId: Joi.string().custom(customValidate.objectId).allow('', null).optional(),
        displayOrder: Joi.number().integer().min(1).optional(),
        status: Joi.string().valid(...Object.values(bannerConstant.STATUS)).optional(),
        startAt: Joi.date().allow(null).optional(),
        endAt: Joi.date().allow(null).optional()
    }),
    params: Joi.object({
        bannerId: Joi.string().custom(customValidate.objectId).required()
    })
}

const checkId = {
    params: Joi.object({
        bannerId: Joi.string().custom(customValidate.objectId).required()
    })
}

export default {
    getBanners,
    createBanner,
    updateBanner,
    checkId
}