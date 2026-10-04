import { Router } from 'express'
import { validate, authMiddleware } from '../../middlewares'
import { authorValidate } from '../../validates'
import { adminAuthorController } from '../../controllers'

const router = Router()

router.use(authMiddleware.auth, authMiddleware.isAdmin)

router.get('/', validate(authorValidate.getAuthors), adminAuthorController.getAuthors)
router.post('/', validate(authorValidate.createAuthor), adminAuthorController.createAuthor)
router.get('/:authorId', validate(authorValidate.checkId), adminAuthorController.getAuthorById)
router.put('/:authorId', validate(authorValidate.updateAuthor), adminAuthorController.updateAuthor)
router.delete('/:authorId', validate(authorValidate.checkId), adminAuthorController.deleteAuthor)

export default router