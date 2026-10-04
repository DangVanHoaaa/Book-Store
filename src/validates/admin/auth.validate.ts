import Joi from 'joi'

const login = {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Email không đúng định dạng',
        'any.required': 'Email là bắt buộc'
      }),
      password: Joi.string().required().messages({
        'any.required': 'Mật khẩu là bắt buộc'
      })
    })
}

export default { login }