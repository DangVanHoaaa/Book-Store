import { Schema, model, Types } from 'mongoose'

export interface IFavorite {
    _id: Types.ObjectId
    userId: Types.ObjectId
    productId: Types.ObjectId
    createdAt?: Date
    updatedAt?: Date
}

const favoriteSchema = new Schema<IFavorite>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true }
    },
    { timestamps: true, versionKey: false }
)

favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true })

export default model<IFavorite>('Favorite', favoriteSchema)