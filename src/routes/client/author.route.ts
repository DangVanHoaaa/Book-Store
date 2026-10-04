import { Router } from 'express'
import { clientAuthorController } from '../../controllers'

const router = Router()


router.get('/', clientAuthorController.getAuthors)
router.get('/:slug', clientAuthorController.getAuthorBySlug)

export default router