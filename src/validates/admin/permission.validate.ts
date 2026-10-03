import Joi from 'joi'

const getPermissions = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    cursor: Joi.string().allow('').trim(), 
    keyword: Joi.string().allow(''),
    module: Joi.string().allow(''),
    status: Joi.string().allow('')
  })
}

const toggleStatus = {
  params: Joi.object({
    id: Joi.string().length(24).required().messages({
      'string.length': 'ID Permission phải là chuỗi 24 ký tự ObjectId'
    })
  })
}

export default {
  getPermissions,
  toggleStatus
}