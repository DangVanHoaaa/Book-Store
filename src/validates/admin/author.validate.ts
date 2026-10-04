import Joi from 'joi'
import customValidate from './custom.validate'
import { authorConstant } from '../../constants'

const getAuthors = {
    query: Joi.object({
        limit: Joi.number().integer().min(1).default(10),
        cursor: Joi.string().custom(customValidate.objectId).allow('').trim(),
        keyword: Joi.string().allow('').trim(),
        status: Joi.string().valid(...Object.values(authorConstant.STATUS)).allow('').trim()
    })
}

const createAuthor = {
    body: Joi.object({
        name: Joi.string().trim().min(2).max(100).required().messages({
        'string.empty': 'Tên tác giả không được để trống',
        'any.required': 'Tên tác giả là bắt buộc'
        }),
        bio: Joi.string().trim().allow('', null).optional(),
        avatar: Joi.string().trim().allow('', null).optional(),
        status: Joi.string().valid(...Object.values(authorConstant.STATUS)).default(authorConstant.STATUS.ACTIVE)
    })
}

const updateAuthor = {
    body: Joi.object({
        name: Joi.string().trim().min(2).max(100).required().messages({
        'string.empty': 'Tên tác giả không được để trống'
        }),
        bio: Joi.string().trim().allow('', null).optional(),
        avatar: Joi.string().trim().allow('', null).optional(),
        status: Joi.string().valid(...Object.values(authorConstant.STATUS))
    }),
    params: Joi.object({
        authorId: Joi.string().custom(customValidate.objectId).required()
    })
}

const checkId = {
    params: Joi.object({
        authorId: Joi.string().custom(customValidate.objectId).required()
    })
}

export default {
    getAuthors,
    createAuthor,
    updateAuthor,
    checkId
}