import { Router } from 'express'
//import client
import authClientRouter from './client/auth.route'
import categoryClientRouter from './client/category.route'


//import admin
import authAdminRouter from './admin/auth.route'
import permissionAdminRouter from './admin/permission.route'
import roleAdminRouter from './admin/role.route'
import categoryAdminRouter from './admin/category.route'

const routers: Router = Router()
//router admin
routers.use('/admin/auth', authAdminRouter)
routers.use('/admin/permissions', permissionAdminRouter)
routers.use('/admin/roles', roleAdminRouter)
routers.use('/admin/categories', categoryAdminRouter)


//router client
routers.use('/auth', authClientRouter)
routers.use('/categories', categoryClientRouter)

export default routers