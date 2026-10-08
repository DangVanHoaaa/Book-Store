import { Router } from 'express'
import { clientAdressController } from '../../controllers'
import { addressValidate } from '../../validates'
import { validate, authMiddleware } from '../../middlewares'

const router = Router()


router.use(authMiddleware.auth)

router.get('/', clientAdressController.getAddresses)
router.post('/', validate(addressValidate.createAddress), clientAdressController.createAddress)
router.patch('/:id', validate(addressValidate.updateAddress), clientAdressController.updateAddress)
router.patch('/:id/default', validate(addressValidate.setDefaultAddress), clientAdressController.setDefaultAddress)
router.delete('/:id', validate(addressValidate.deleteAddress), clientAdressController.deleteAddress)

export default router