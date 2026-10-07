import { Schema, model, Types } from 'mongoose'
import { PHONE_REGEX } from '../constants/address.constant' // 👈 Import constant Regex SĐT

export interface IAddress {
    _id: Types.ObjectId
    userId: Types.ObjectId
    fullname: string       
    phone: string         
    provinceName: string   
    provinceCode: number   
    districtName: string   
    districtCode: number  
    wardName: string       
    wardCode: string      
    detail: string        
    isDefault: boolean     
    createdAt?: Date
    updatedAt?: Date
}

const addressSchema = new Schema<IAddress>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        fullname: { type: String, required: true, trim: true },
        phone: { 
        type: String, 
        required: true, 
        trim: true,
        match: [PHONE_REGEX, 'Số điện thoại không đúng định dạng Việt Nam (10 chữ số)'] 
        },
        provinceName: { type: String, required: true, trim: true },
        provinceCode: { type: Number, required: true },
        districtName: { type: String, required: true, trim: true },
        districtCode: { type: Number, required: true },
        wardName: { type: String, required: true, trim: true },
        wardCode: { type: String, required: true, trim: true },
        detail: { type: String, required: true, trim: true },
        isDefault: { type: Boolean, default: false }
    },
    { timestamps: true, versionKey: false }
)

export default model<IAddress>('Address', addressSchema)