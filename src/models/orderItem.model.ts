import { Schema, model, Types } from 'mongoose'

export interface IOrderItem {
    _id: Types.ObjectId
    orderId: Types.ObjectId
    productId: Types.ObjectId
    productTitle: string
    productImage?: string
    variantOption?: string
    quantity: number
    price: number
    totalPrice: number
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productTitle: { type: String, required: true },
    productImage: { type: String, default: '' },
    variantOption: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 }
  },
  { timestamps: true, versionKey: false }
)

export default model<IOrderItem>('OrderItem', orderItemSchema)