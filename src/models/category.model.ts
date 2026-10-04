import mongoose, { Schema, model, Types } from 'mongoose'
import slug from 'mongoose-slug-updater'
import { categoryConstant } from '../constants'

mongoose.plugin(slug)

export interface ICategory {
  name: string
  slug: string
  parentId?: Types.ObjectId | null
  description?: string
  status: string
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, slug: 'name', unique: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null, index: true }, // 👈 TRƯỜNG LƯU ID DANH MỤC CHA!
    description: String,
    status: { type: String, enum: categoryConstant.STATUS, default: categoryConstant.STATUS.ACTIVE, index: true }
  },
  { timestamps: true, versionKey: false }
)

export default model<ICategory>('Category', categorySchema)