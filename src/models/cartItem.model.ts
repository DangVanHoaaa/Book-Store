import { Schema, model, Types } from 'mongoose'
import { CART_LIMITS } from '../constants/cart.constant' 

export interface ICartItem {
    _id: Types.ObjectId
    cartId: Types.ObjectId
    productId: Types.ObjectId
    variantOption?: string 
    quantity: number
    price: number
    createdAt?: Date
    updatedAt?: Date
}

const cartItemSchema = new Schema<ICartItem>(
  {
        cartId: { type: Schema.Types.ObjectId, ref: 'Cart', required: true, index: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
        variantOption: { type: String, trim: true, default: '' },
        quantity: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: CART_LIMITS.MAX_QUANTITY_PER_ITEM, 
        default: 1 
        },
        price: { type: Number, required: true, min: 0 }
    },
    { timestamps: true, versionKey: false }
)


cartItemSchema.index({ cartId: 1, productId: 1, variantOption: 1 })

export default model<ICartItem>('CartItem', cartItemSchema)