import Joi from 'joi'

// 1. Validate cho API gửi OTP về email
const sendOtp = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email không đúng định dạng',
      'any.required': 'Email là bắt buộc'
    })
  })
}

// 2. Validate cho API xác thực OTP
const verifyOtp = {
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required().messages({
      'string.length': 'Mã OTP phải đúng 6 chữ số',
      'any.required': 'Mã OTP là bắt buộc'
    })
  })
}

// 3. Validate cho API Đăng ký
const register = {
  body: Joi.object({
    fullname: Joi.string().required().trim().messages({
      'any.required': 'Họ và tên là bắt buộc'
    }),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'any.required': 'Mật khẩu là bắt buộc'
    }),
    phone: Joi.string().optional()
  })
}

// 4. Validate cho API Đăng nhập
const login = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
}

// 5. Validate cho API Refresh Token
const refreshToken = {
  body: Joi.object({
    refreshToken: Joi.string().required().messages({
      'any.required': 'Refresh token là bắt buộc'
    })
  })
}

export default {
  sendOtp,
  verifyOtp,
  register,
  login,
  refreshToken
}