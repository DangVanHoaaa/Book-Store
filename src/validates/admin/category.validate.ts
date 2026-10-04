import Joi from 'joi'
import customValidate from './custom.validate'
import { categoryConstant } from '../../constants'

const getCategories = {
  query: Joi.object({
    status: Joi.string().valid(...Object.values(categoryConstant.STATUS)).allow('').trim()
  })
}

const createCategory = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      'string.empty': 'Tên danh mục không được để trống',
      'any.required': 'Tên danh mục là bắt buộc'
    }),
    parentId: Joi.string().custom(customValidate.objectId).allow('', null).optional().messages({
      'any.invalid': 'ID danh mục cha không hợp lệ.'
    }),
    description: Joi.string().trim().max(500).allow('', null).optional(),
    status: Joi.string().valid(...Object.values(categoryConstant.STATUS)).default(categoryConstant.STATUS.ACTIVE)
  })
}

const updateCategory = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      'string.empty': 'Tên danh mục không được để trống'
    }),
    parentId: Joi.string().custom(customValidate.objectId).allow('', null).optional(),
    description: Joi.string().trim().max(500).allow('', null).optional(),
    status: Joi.string().valid(...Object.values(categoryConstant.STATUS))
  }),
  params: Joi.object({
    categoryId: Joi.string().custom(customValidate.objectId).required()
  })
}

const checkId = {
  params: Joi.object({
    categoryId: Joi.string().custom(customValidate.objectId).required()
  })
}

export default {
  getCategories,
  createCategory,
  updateCategory,
  checkId
}