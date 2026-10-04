import mongoose, { Schema, model } from 'mongoose'
import slug from 'mongoose-slug-updater'
import { authorConstant } from '../constants'

mongoose.plugin(slug)

export interface IAuthor {
  name: string
  slug: string
  bio?: string
  avatar?: string
  status: string
}

const authorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, slug: 'name', unique: true, index: true },
    bio: { type: String, trim: true },
    avatar: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(authorConstant.STATUS),
      default: authorConstant.STATUS.ACTIVE,
      index: true
    }
  },
  { timestamps: true, versionKey: false }
)

export default model<IAuthor>('Author', authorSchema)