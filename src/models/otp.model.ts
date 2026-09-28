import { model, Schema } from 'mongoose'

const otpSchema = new Schema({
  email: { type: String, required: true, unique: true },
  otp:   { type: String, required: true },
  verified: { type: Boolean, default: false },
  expireAt: { type: Date, required: true, expires: 0 },
  lastResendAt: Date, 
  verifyAttempts: { type: Number, default: 0, max: 5 }
})

export default model('Otp', otpSchema)