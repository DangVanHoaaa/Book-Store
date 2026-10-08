import { Router } from 'express'
import { favoriteValidate } from '../../validates'
import { validate, authMiddleware } from '../../middlewares'
import { clientFavoriteController } from '../../controllers'

const router = Router()

router.use(authMiddleware.auth)

router.get('/', validate(favoriteValidate.getFavorites), clientFavoriteController.getFavorites)
router.post('/toggle', validate(favoriteValidate.toggleFavorite), clientFavoriteController.toggleFavorite)

export default router