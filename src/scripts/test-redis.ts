import redis from '../config/redis.config'

const runTest = async () => {
  console.log('🚀 BẮT ĐẦU TEST REDIS...\n')

  // 1. LỆNH SETEX: Lưu OTP "123456" vào Redis với thời gian sống 10 giây
  await redis.setex('otp:test@gmail.com', 10, '123456')
  console.log('✅ 1. [SETEX] Đã lưu OTP "123456" cho email test@gmail.com (Hạn dùng 10 giây)')

  // 2. LỆNH GET: Đọc dữ liệu ra từ Redis
  const otpCode = await redis.get('otp:test@gmail.com')
  console.log('📖 2. [GET]   Đã đọc mã OTP từ Redis ra:', otpCode)

  // 3. LỆNH TTL: Kiểm tra xem key còn sống bao nhiêu giây nữa
  const secondsLeft = await redis.ttl('otp:test@gmail.com')
  console.log('⏳ 3. [TTL]   Số giây còn sống trước khi tự xóa:', secondsLeft, 'giây')

  // 4. LỆNH DEL: Xóa thủ công key khỏi Redis
  await redis.del('otp:test@gmail.com')
  console.log('🗑️ 4. [DEL]   Đã xóa thủ công khóa otp:test@gmail.com khỏi Redis!')

  // Kiểm tra lại sau khi xóa
  const checkAgain = await redis.get('otp:test@gmail.com')
  console.log('🔍 5. Kiểm tra lại sau khi xóa:', checkAgain) // Trả về null

  process.exit(0)
}

runTest()