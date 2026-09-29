import Redis from 'ioredis'
import env from './env.config'

// Kết nối tới Redis Docker trên máy
const redis = new Redis(env.redis.redisURL || 'redis://localhost:6379')

redis.on('connect', () => {
  console.log(' Kết nối Redis Server thành công!')
})

redis.on('error', (err) => {
  console.error(' Lỗi kết nối Redis:', err.message)
})

export default redis