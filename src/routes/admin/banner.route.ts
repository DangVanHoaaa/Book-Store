import { Router } from 'express'
import bannerController from '../../controllers/admin/banner.controller'
import bannerValidate from '../../validates/admin/banner.validate'
import { validate, authMiddleware } from '../../middlewares'

const router = Router()


router.use(authMiddleware.auth, authMiddleware.isAdmin)

router.get('/', validate(bannerValidate.getBanners), bannerController.getBanners)
router.get('/:bannerId', validate(bannerValidate.checkId), bannerController.getBannerById)
router.post('/', validate(bannerValidate.createBanner), bannerController.createBanner)
router.patch('/:bannerId', validate(bannerValidate.updateBanner), bannerController.updateBanner)
router.delete('/:bannerId', validate(bannerValidate.checkId), bannerController.deleteBanner)

export default router