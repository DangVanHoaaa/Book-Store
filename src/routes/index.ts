import { Router } from 'express'
import authClientRouter from './client/auth.route'
import authAdminRouter from './admin/auth.route'

const routers: Router = Router()
//router admin
routers.use('/admin/auth', authAdminRouter)


//router client
routers.use('/auth', authClientRouter)

export default routers