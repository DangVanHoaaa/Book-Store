import { Router } from 'express'
import authClientRouter from './client/auth.route'
import authAdminRouter from './admin/auth.route'
import permissionAdminRouter from './admin/permission.route'
import roleAdminRouter from './admin/role.route'

const routers: Router = Router()
//router admin
routers.use('/admin/auth', authAdminRouter)
routers.use('/admin/permissions', permissionAdminRouter)
routers.use('/admin/roles', roleAdminRouter)


//router client
routers.use('/auth', authClientRouter)

export default routers