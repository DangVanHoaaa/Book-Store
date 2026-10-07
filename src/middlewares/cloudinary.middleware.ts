import { Request, Response, NextFunction } from 'express'
import cloudinary from '../config/cloudinary.config'
import { ApiError } from '../utils'
import { StatusCodes } from 'http-status-codes'
import multer from 'multer'


const uploadImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[]

        if (!files || (Array.isArray(files) && files.length === 0) || (typeof files === 'object' && Object.keys(files).length === 0)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Vui lòng chọn ít nhất 1 file ảnh để upload.')
        }

        const uploadedResults: any = {}

        if (Array.isArray(files)) {
          for (const file of files) {
            const fieldName = file.fieldname || 'file'
            if (!uploadedResults[fieldName]) uploadedResults[fieldName] = []

            const result: any = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: `bookstore/${fieldName}` },
                (error, result) => {
                  if (error) return reject(error)
                  resolve(result)
                }
              )
              stream.end(file.buffer)
            })

            uploadedResults[fieldName].push({
              url: result.secure_url,
              publicId: result.public_id
            })
          }
        } else if (typeof files === 'object') {
          for (const fieldName of Object.keys(files)) {
            const fileList = files[fieldName]
            uploadedResults[fieldName] = []

            for (const file of fileList) {
              const result: any = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { folder: `bookstore/${fieldName}` },
                  (error, result) => {
                    if (error) return reject(error)
                    resolve(result)
                  }
                )
                stream.end(file.buffer)
              })

              uploadedResults[fieldName].push({
                url: result.secure_url,
                publicId: result.public_id
              })
            }
          }
        }

        req.body.uploadedImages = uploadedResults
        next()
  } catch (error: any) {
    next(error)
  }
}

export default {
    uploadImages
}