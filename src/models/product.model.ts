import mongoose, { Schema, model, Types } from 'mongoose'
import slug from 'mongoose-slug-updater'
import { productConstant } from '../constants'

mongoose.plugin(slug)

export interface IImage {
    url: string
    publicId?: string
}

export interface IVariant {
    title: string
    option: string
    quantity: number
    price: number
    image?: IImage
}

export interface IProduct {
    title: string
    description?: string
    images: IImage[]
    authors: Types.ObjectId[]
    publisher?: string
    publishingYear?: number
    categoryId?: Types.ObjectId
    seriesId?: Types.ObjectId
    variants?: IVariant[]
    language?: string
    ISBN?: string
    page?: number
    format?: string
    quantity: number
    price: number
    weight?: number
    sold: number
    avgRating: number
    reviewCount: number
    status: string
    slug: string
    deleted: boolean
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    images: [{ url: String, publicId: String }],
    authors: [{ type: Schema.Types.ObjectId, ref: 'Author', index: true }],
    publisher: { type: String, trim: true },
    publishingYear: Number,
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', index: true },
    seriesId: { type: Schema.Types.ObjectId, ref: 'Series', index: true },
    variants: [
      {
        title: String,
        option: { type: String, required: true },
        quantity: { type: Number, min: 0 },
        price: { type: Number, min: 0 },
        image: { url: String, publicId: String }
      }
    ],
    language: String,
    ISBN: String,
    page: { type: Number, min: 0 },
    format: String,
    quantity: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
    weight: Number,
    sold: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(productConstant.STATUS),
      default: productConstant.STATUS.AVAILABLE,
      index: true
    },
    slug: { type: String, slug: 'title', unique: true, index: true },
    deleted: { type: Boolean, default: false, index: true }
  },
  { timestamps: true, versionKey: false }
)

export default model<IProduct>('Product', productSchema)