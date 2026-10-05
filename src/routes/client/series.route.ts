import { Router } from 'express'
import { clientSeriesController } from '../../controllers'

const router = Router()


router.get('/', clientSeriesController.getSeries)
router.get('/:slug', clientSeriesController.getSeriesBySlug)

export default router