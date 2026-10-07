import { Router } from 'express'
import addressController from '../../controllers/client/address.controller'
import { addressValidate } from '../../validates'
import { validate, authMiddleware } from '../../middlewares'

const router = Router()


router.use(authMiddleware.auth)

router.get('/', addressController.getAddresses)
router.post('/', validate(addressValidate.createAddress), addressController.createAddress)
router.patch('/:id', validate(addressValidate.updateAddress), addressController.updateAddress)
router.patch('/:id/default', validate(addressValidate.setDefaultAddress), addressController.setDefaultAddress)
router.delete('/:id', validate(addressValidate.deleteAddress), addressController.deleteAddress)

export default router