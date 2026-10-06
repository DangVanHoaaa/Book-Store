import { Router } from 'express'
import { clientBannerController } from '../../controllers'

const router = Router()

router.get('/', clientBannerController.getBanners)

export default router