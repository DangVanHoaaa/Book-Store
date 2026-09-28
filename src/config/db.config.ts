import mongoose from 'mongoose'
import env from './env.config'

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.db.mongoUri)
    console.log(`Kết nối MongoDB thành công: ${conn.connection.host}`)
  } catch (error: any) {
    console.error(`Kết nối MongoDB thất bại: ${error.message}`)
    process.exit(1)
  }
}