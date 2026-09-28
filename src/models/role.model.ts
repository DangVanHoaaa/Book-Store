import mongoose, { model, Schema, Types } from 'mongoose'
import slug from 'mongoose-slug-updater'
import { roleConstant } from '../constants'

mongoose.plugin(slug)

export interface IRole {
  name: string
  description?: string
  slug: string
  permissions: Types.ObjectId[]
  status: string
  isSystem: boolean  
}

const roleSchema = new Schema<IRole>({
  name:        { type: String, required: true },
  description: String,
  slug:        { type: String, slug: 'name', unique: true, index: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission', index: true }],
  status:      { type: String, enum: roleConstant.STATUS, default: roleConstant.STATUS.ACTIVE, index: true },
  isSystem:    { type: Boolean, default: false }
}, { timestamps: true, versionKey: false })

export default model<IRole>('Role', roleSchema) 