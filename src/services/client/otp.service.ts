import nodemailer from "nodemailer";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils";
import {  userModel } from "../../models";
import env from "../../config/env.config";
import crypto from 'crypto'
import redis from "../../config/redis.config";
import { attempt } from "joi";

// create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.email.user,
        pass: env.email.password
    }
})

// send otp ve gmail
const sendOTP = async (email: string) => {
    const existingUser  = await userModel.findOne({email})
    if(existingUser){
        throw new ApiError(StatusCodes.BAD_REQUEST,'Email đã đăng ký tài khoản')
    }

    const lockTTL = await redis.ttl(`otp_lock:${email}`)
    if(lockTTL > 0)
    {
        throw new ApiError(StatusCodes.TOO_MANY_REQUESTS,`Vui lòng đợi ${lockTTL} giây trước khi yêu cầu mã OTP mới.`)
    }

    const otpCode = crypto.randomInt(100000, 1000000).toString()

    await redis.setex(`otp:${email}`,300, JSON.stringify({otp: otpCode, attempt: 0}))
    await redis.setex(`otp_lock:${email}`,60,"locked")

    await transporter.sendMail({
    from: `"BookStore Support" <${env.email.user}>`,
    to: email,
    subject: 'Mã xác thực OTP đăng ký tài khoản BookStore',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Xác thực tài khoản BookStore</h2>
        <p>Mã OTP của bạn là: <b style="font-size: 24px; color: #007bff;">${otpCode}</b></p>
        <p>Mã này có hiệu lực trong <b>5 phút</b>.</p>
      </div>
    `
  })

  return { message: 'Mã OTP đã được gửi đến email của bạn.' }
}

// xac minh otp
const verifyOtp = async (email:string, otpInput: string) => {
    const data = await redis.get(`otp:${email}`)
    if(!data)
    {
        throw new ApiError(StatusCodes.BAD_REQUEST,'Mã otp không tồn tại hoặc đã hết hạn')
    }
    const otpData = JSON.parse(data)
    if(otpData.attempt >= 5)
    {
        await redis.del(`otp:${email}`)
        throw new ApiError(StatusCodes.TOO_MANY_REQUESTS,'Bạn đã nhập sai quá 5 lần. Vui lòng yêu cầu mã otp mới')
    }

    if(otpData.otp !== otpInput)
    {
        otpData.attempt += 1
        const ttl = await redis.ttl(`otp:${email}`)
        if( ttl > 0)
        {
            await redis.setex(`otp:${email}`, ttl, JSON.stringify(otpData));
        }
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Mã otp không chính xác')
    }

    await redis.del(`otp:${email}`);
    await redis.setex(`otp_verified:${email}`, 900, "true");

    return {message: 'Mã otp đã được xác nhận '}
}

export default{
    sendOTP,
    verifyOtp
}