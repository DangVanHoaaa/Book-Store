import { Request } from 'express'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import env from '../config/env.config'

const extractToken = (req: Request): string | undefined => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined
    }
    const token = authHeader.split(' ')[1]

    return token
}

const generateAccessToken = (payload: object): string => {
    const options: SignOptions = { expiresIn: env.jwt.accessTokenExpiresIn as SignOptions['expiresIn'] }
    return jwt.sign(payload, env.jwt.accessToken, options)
}

const generateRefreshToken = (payload: object): string => {
    const options: SignOptions = { expiresIn: env.jwt.refreshTokenExpiresIn as SignOptions['expiresIn'] }
    return jwt.sign(payload, env.jwt.refreshToken, options)
  }

const verifyAccessToken = (token: string): JwtPayload =>
    jwt.verify(token, env.jwt.accessToken) as JwtPayload

const verifyRefreshToken = (token: string): JwtPayload =>
    jwt.verify(token, env.jwt.refreshToken) as JwtPayload

export default { extractToken, generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken }