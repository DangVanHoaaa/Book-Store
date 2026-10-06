import { Schema, Types, model } from 'mongoose'
import bcrypt from 'bcrypt'
import { userConstant } from '../constants'
import env from '../config/env.config'

export interface IUser {
    fullname: string
    email: string
    phone?: string
    password: string
    roleId: Types.ObjectId
    status?: string
    isVerified?: boolean
    lastLogin?: Date | null
    deleted?: boolean
    deletedAt?: Date
  isPasswordMatch(password: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
    fullname:   { type: String, required: true },
    email:      { type: String, required: true, unique: true, index: true },
    phone:      String,
    password:   { type: String, required: true, select: false },
    roleId:     { type: Schema.Types.ObjectId, ref: 'Role', index: true },
    status:     { type: String, enum: userConstant.STATUS, default: userConstant.STATUS.ACTIVE, index: true },
    isVerified: { type: Boolean, default: false },
    lastLogin:  { type: Date, default: null },
    deleted:    { type: Boolean, default: false },
    deletedAt:  Date
}, { timestamps: true })


userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, env.bcrypt.saltRounds)
})
userSchema.methods.isPasswordMatch = async function (passwordInput: string): Promise<boolean> {
  return bcrypt.compare(passwordInput, this.password)
}

export default model<IUser>('User', userSchema)