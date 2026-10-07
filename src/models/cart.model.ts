import { Schema, model, Types } from 'mongoose'

export interface ICart {
    _id: Types.ObjectId
    userId: Types.ObjectId
    createdAt?: Date
    updatedAt?: Date
}

const cartSchema = new Schema<ICart>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true }
    },
    { timestamps: true, versionKey: false }
)

export default model<ICart>('Cart', cartSchema)