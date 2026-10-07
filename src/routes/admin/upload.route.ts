import { Router } from 'express'
import multer from 'multer'
import { cloudinaryMiddleware, authMiddleware } from '../../middlewares'
import uploadController from '../../controllers/admin/upload.controller'

const uploadRouter = Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

uploadRouter.use(authMiddleware.auth, authMiddleware.isAdmin)
uploadRouter.post(
    '/images',
    upload.any(),
    cloudinaryMiddleware.uploadImages,
    uploadController.upload
)

export default uploadRouter