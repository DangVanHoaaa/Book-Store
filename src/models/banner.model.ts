import mongoose, { Schema, model } from 'mongoose'
import { bannerConstant } from '../constants'

export interface IBanner {
    title: string
    description?: string
    image: string
    logo?: { url: string; publicId?: string }
    thumbnail?: { url: string; publicId?: string }
    imageUrl?: { url: string; publicId?: string }
    linkType?: string
    linkValue?: string
    productId?: mongoose.Types.ObjectId
    displayOrder: number
    status: string
    startAt?: Date
    endAt?: Date
}

const bannerSchema = new Schema<IBanner>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        image: { type: String, required: true, trim: true },
        linkType: {type: String,enum: Object.values(bannerConstant.LINKTYPE),default: bannerConstant.LINKTYPE.URL},
        linkValue: { type: String, trim: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        displayOrder: { type: Number, default: 1, index: true },
        status: {type: String,enum: Object.values(bannerConstant.STATUS),default: bannerConstant.STATUS.ACTIVE,index: true},
        startAt: { type: Date },
        endAt: { type: Date }
    },
    { timestamps: true, versionKey: false }
)

export default model<IBanner>('Banner', bannerSchema)