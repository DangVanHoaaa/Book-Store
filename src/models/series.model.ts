import mongoose, { Schema, model } from 'mongoose'
import slug from 'mongoose-slug-updater'
import { seriesConstant } from '../constants'

mongoose.plugin(slug)

export interface ISeries {
  name: string
  slug: string
  description?: string
  coverImage?: string
  status: string
}

const seriesSchema = new Schema<ISeries>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, slug: 'name', unique: true, index: true },
        description: { type: String, trim: true },
        coverImage: { type: String, trim: true },
        status: {
        type: String,
        enum: Object.values(seriesConstant.STATUS),
        default: seriesConstant.STATUS.ACTIVE,
        index: true
        }
    },
    { timestamps: true, versionKey: false }
)

export default model<ISeries>('Series', seriesSchema)