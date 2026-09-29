import dotenv from 'dotenv'
import redis from './redis.config'
dotenv.config()

const env = {
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3000
  },
  db: {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/book-store'
  },
  client: {
    url: process.env.CLIENT_URL || 'http://localhost:5173' // Thêm dòng này để đọc CLIENT_URL từ .env
  },
  bcrypt: {
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10)
  },
  jwt: {
    accessToken: process.env.JWT_ACCESS_SECRET as string,
    refreshToken: process.env.JWT_REFRESH_SECRET as string,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRESIN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRESIN || '15d'
  },
  email: {
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASS || ''
  },
  redis: {
    redisURL: process.env.REDIS_URL
  }
  

}

export default env