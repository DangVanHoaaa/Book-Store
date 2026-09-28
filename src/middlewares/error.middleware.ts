
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError'
import mongoose from 'mongoose'
import env from '../config/env.config'

export const errorConverter = (err: any,req: Request,res: Response,next: NextFunction) => {
  let error = err
  if (!(error instanceof ApiError)) {
    let statusCode

    if (error.statusCode) {
      statusCode = error.statusCode
    }

    else if (error instanceof mongoose.Error) {
      statusCode = StatusCodes.BAD_REQUEST
    }
    else {
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    }

    error = new ApiError(
      statusCode,
      error.message || 'Server Error',
      false,
      error.stack
    )
  }

  next(error)
}

export const errorHandler = (err: ApiError,req: Request,res: Response,next: NextFunction) => {
  let statusCode = err.statusCode
  let message = err.message

  if (env.server.nodeEnv === 'production' && !err.isOperational) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    message = 'Server xảy ra lỗi, vui lòng thử lại sau.'
  }

  const responseData: any = {
    statusCode: statusCode,
    message: message
  }

  if (env.server.nodeEnv === 'development') {
    responseData.stack = err.stack
  }

  res.status(statusCode).json(responseData)
}

