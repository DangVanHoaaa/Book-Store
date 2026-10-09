import { Schema, model, Types } from 'mongoose'
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from '../constants/order.constant'

export interface IShippingInfo {
    fullname: string
    phone: string
    provinceName: string
    districtName: string
    wardName: string
    detail: string
}

export interface IOrder {
    _id: Types.ObjectId
    orderCode: string           
    userId: Types.ObjectId
    shippingInfo: IShippingInfo 
    paymentMethod: string     
    paymentStatus: string    
    orderStatus: string      
    totalPrice: number        
    shippingFee: number        
    finalPrice: number       
    note?: string               
    createdAt?: Date
    updatedAt?: Date
}

const orderSchema = new Schema<IOrder>(
  {
    orderCode: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    shippingInfo: {
        fullname: { type: String, required: true },
        phone: { type: String, required: true },
        provinceName: { type: String, required: true },
        districtName: { type: String, required: true },
        wardName: { type: String, required: true },
        detail: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: Object.values(PAYMENT_METHOD),
        default: PAYMENT_METHOD.COD
    },
    paymentStatus: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.UNPAID
    },
    orderStatus: {
        type: String,
        enum: Object.values(ORDER_STATUS),
        default: ORDER_STATUS.AWAITING_CONFIRMATION
    },
    totalPrice: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    finalPrice: { type: Number, required: true, min: 0 },
    note: { type: String, trim: true, default: '' }
  },
  { timestamps: true, versionKey: false }
)

orderSchema.index({ userId: 1, createdAt: -1 })       
orderSchema.index({ orderStatus: 1, createdAt: -1 })  
orderSchema.index({ paymentStatus: 1, createdAt: -1 })

export default model<IOrder>('Order', orderSchema)