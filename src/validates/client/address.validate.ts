import Joi from 'joi'
import customValidate from '../admin/custom.validate'
import { PHONE_REGEX } from '../../constants/address.constant'


const createAddress = {
    body: Joi.object().keys({
        fullname: Joi.string().required().trim().messages({
        'any.required': 'Họ và tên người nhận là bắt buộc',
        'string.empty': 'Họ và tên không được để trống'
        }),
        phone: Joi.string().required().pattern(PHONE_REGEX).messages({
        'any.required': 'Số điện thoại là bắt buộc',
        'string.pattern.base': 'Số điện thoại không hợp lệ (Phải gồm 10 chữ số đầu 03, 05, 07, 08, 09)'
        }),
        provinceName: Joi.string().required().trim().messages({
        'any.required': 'Tên Tỉnh/Thành phố là bắt buộc'
        }),
        provinceCode: Joi.number().required().messages({
        'any.required': 'Mã Tỉnh/Thành phố là bắt buộc'
        }),
        districtName: Joi.string().required().trim().messages({
        'any.required': 'Tên Quận/Huyện là bắt buộc'
        }),
        districtCode: Joi.number().required().messages({
        'any.required': 'Mã Quận/Huyện là bắt buộc'
        }),
        wardName: Joi.string().required().trim().messages({
        'any.required': 'Tên Phường/Xã là bắt buộc'
        }),
        wardCode: Joi.string().required().trim().messages({
        'any.required': 'Mã Phường/Xã là bắt buộc'
        }),
        detail: Joi.string().required().trim().messages({
        'any.required': 'Địa chỉ chi tiết (số nhà, tên đường) là bắt buộc'
        }),
        isDefault: Joi.boolean().default(false)
    })
}


const updateAddress = {
    params: Joi.object().keys({
        id: Joi.string().required().custom(customValidate.objectId)
    }),
    body: Joi.object().keys({
        fullname: Joi.string().trim(),
        phone: Joi.string().pattern(PHONE_REGEX).messages({
        'string.pattern.base': 'Số điện thoại không hợp lệ'
        }),
        provinceName: Joi.string().trim(),
        provinceCode: Joi.number(),
        districtName: Joi.string().trim(),
        districtCode: Joi.number(),
        wardName: Joi.string().trim(),
        wardCode: Joi.string().trim(),
        detail: Joi.string().trim(),
        isDefault: Joi.boolean()
    })
}


const setDefaultAddress = {
    params: Joi.object().keys({
        id: Joi.string().required().custom(customValidate.objectId)
    })
}

const deleteAddress = {
    params: Joi.object().keys({
        id: Joi.string().required().custom(customValidate.objectId)
    })
}

export default {
    createAddress,
    updateAddress,
    setDefaultAddress,
    deleteAddress
}