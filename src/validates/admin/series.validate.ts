import Joi from 'joi'
import customValidate from './custom.validate'
import { seriesConstant } from '../../constants'

const getSeries = {
    query: Joi.object({
        limit: Joi.number().integer().min(1).default(10),
        cursor: Joi.string().custom(customValidate.objectId).allow('').trim(),
        keyword: Joi.string().allow('').trim(),
        status: Joi.string().valid(...Object.values(seriesConstant.STATUS)).allow('').trim()
    })
}

const createSeries = {
    body: Joi.object({
        name: Joi.string().trim().min(2).max(100).required().messages({
        'string.empty': 'Tên bộ sách không được để trống',
        'any.required': 'Tên bộ sách là bắt buộc'
        }),
        description: Joi.string().trim().allow('', null).optional(),
        coverImage: Joi.string().trim().allow('', null).optional(),
        status: Joi.string().valid(...Object.values(seriesConstant.STATUS)).default(seriesConstant.STATUS.ACTIVE)
    })
}

const updateSeries = {
    body: Joi.object({
        name: Joi.string().trim().min(2).max(100).required(),
        description: Joi.string().trim().allow('', null).optional(),
        coverImage: Joi.string().trim().allow('', null).optional(),
        status: Joi.string().valid(...Object.values(seriesConstant.STATUS))
    }),
    params: Joi.object({
        seriesId: Joi.string().custom(customValidate.objectId).required()
    })
}

const checkId = {
    params: Joi.object({
        seriesId: Joi.string().custom(customValidate.objectId).required()
    })
}

export default {
    getSeries,
    createSeries,
    updateSeries,
    checkId
}