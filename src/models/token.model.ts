import { Schema, model, Types } from 'mongoose'

export interface IToken {
  userId: Types.ObjectId   
  refreshToken: string    
  expireAt: Date           
}

const tokenSchema = new Schema<IToken>(
  {
    userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    refreshToken: { type: String, required: true },
    expireAt: { type: Date, expires: 0 }
  },
  { timestamps: true }
)

export default model<IToken>('Token', tokenSchema)