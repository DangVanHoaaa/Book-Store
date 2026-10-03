import Joi from 'joi'
import customValidate from './custom.validate'
import { roleConstant } from '../../constants'


const getRoles = {
  query: Joi.object({
    limit: Joi.number().integer().min(1).default(10),
    cursor: Joi.string().custom(customValidate.objectId).allow('').trim(),
    status: Joi.string().valid(...Object.values(roleConstant.STATUS)).allow('').trim()
  })
}
const createRole = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(50).required().messages({
      'string.empty': 'Tên vai trò không được để trống',
      'string.min': 'Tên vai trò phải có ít nhất {#limit} ký tự',
      'string.max': 'Tên vai trò không được vượt quá {#limit} ký tự',
      'any.required': 'Tên vai trò là bắt buộc'
    }),
    description: Joi.string().trim().max(255).allow('', null).optional().messages({
      'string.max': 'Mô tả không được vượt quá {#limit} ký tự'
    }),
    status: Joi.string()
      .valid(...Object.values(roleConstant.STATUS))
      .default(roleConstant.STATUS.ACTIVE)
      .messages({
        'any.only': 'Trạng thái không hợp lệ'
      })
  })
}

const updateRole = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(50).required().messages({
      'string.empty': 'Tên vai trò không được để trống',
      'string.min': 'Tên vai trò phải có ít nhất {#limit} ký tự',
      'string.max': 'Tên vai trò không được vượt quá {#limit} ký tự',
      'any.required': 'Tên vai trò là bắt buộc'
    }),
    description: Joi.string().trim().max(255).allow('', null).optional(),
    status: Joi.string().valid(...Object.values(roleConstant.STATUS))
  }),
  params: Joi.object({
    roleId: Joi.string().custom(customValidate.objectId).required()
  })
}

const checkId = {
  params: Joi.object({
    roleId: Joi.string().custom(customValidate.objectId).required()
  })
}

const replaceRolePermissions = {
  body: Joi.object({
    permissions: Joi.array()
      .items(
        Joi.string().length(24).hex().messages({
          'string.length': 'permissionId không hợp lệ',
          'string.hex': 'permissionId không hợp lệ'
        })
      )
      .required()
      .messages({
        'array.base': 'Permissions phải là một mảng',
        'any.required': 'Permissions là bắt buộc'
      })
  }),
  params: Joi.object({
    roleId: Joi.string().custom(customValidate.objectId).required()
  })
}

export default {
  getRoles,
  createRole,
  updateRole,
  checkId,
  replaceRolePermissions
}