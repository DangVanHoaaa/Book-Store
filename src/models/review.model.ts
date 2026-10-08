import { Schema, model, Types } from 'mongoose'
import { REVIEW_LIMITS } from '../constants/review.constant'

export interface IImage {
    url: string
    publicId?: string
}

export interface IReview {
    _id: Types.ObjectId
    userId: Types.ObjectId
    productId: Types.ObjectId
    rating: number         
    content: string           
    images?: IImage[]         
    likedBy?: Types.ObjectId[]
    createdAt?: Date
    updatedAt?: Date
}

const reviewSchema = new Schema<IReview>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
        rating: {
        type: Number,
        required: true,
        min: REVIEW_LIMITS.MIN_RATING,
        max: REVIEW_LIMITS.MAX_RATING
        },
        content: { type: String, required: true, trim: true, maxlength: REVIEW_LIMITS.MAX_CONTENT_LENGTH },
        images: [{ url: String, publicId: String }],
        likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    { timestamps: true, versionKey: false }
)

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true })

export default model<IReview>('Review', reviewSchema)