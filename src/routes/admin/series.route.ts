import { Router } from 'express'
import { validate, authMiddleware } from '../../middlewares'
import { seriesValidate } from '../../validates'
import { adminSeriesController } from '../../controllers'

const router = Router()

router.use(authMiddleware.auth, authMiddleware.isAdmin)

router.get('/', validate(seriesValidate.getSeries), adminSeriesController.getSeries)
router.post('/', validate(seriesValidate.createSeries), adminSeriesController.createSeries)
router.get('/:seriesId', validate(seriesValidate.checkId), adminSeriesController.getSeriesById)
router.put('/:seriesId', validate(seriesValidate.updateSeries), adminSeriesController.updateSeries)
router.delete('/:seriesId', validate(seriesValidate.checkId), adminSeriesController.deleteSeries)

export default router