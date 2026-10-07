import { Router } from 'express'
//import client
import authClientRouter from './client/auth.route'
import categoryClientRouter from './client/category.route'
import authorClientRouter from './client/author.route'
import seriesClientRouter from './client/series.route'
import bannerClientRoute from './client/banner.route'
import clientProductRoute from './client/product.route'




//import admin
import authAdminRouter from './admin/auth.route'
import permissionAdminRouter from './admin/permission.route'
import roleAdminRouter from './admin/role.route'
import categoryAdminRouter from './admin/category.route'
import authorAdminRouter from './admin/author.route'
import seriesAdminRouter from './admin/series.route'
import bannerAdminRoute from './admin/banner.route'
import adminProductRoute from './admin/product.route'
import adminUploadRoute from './admin/upload.route'

const routers: Router = Router()

//router admin
routers.use('/admin/auth', authAdminRouter)
routers.use('/admin/permissions', permissionAdminRouter)
routers.use('/admin/roles', roleAdminRouter)
routers.use('/admin/categories', categoryAdminRouter)
routers.use('/admin/authors', authorAdminRouter)
routers.use('/admin/series', seriesAdminRouter)
routers.use('/admin/banners', bannerAdminRoute)
routers.use('/admin/products', adminProductRoute)
routers.use('/admin/upload', adminUploadRoute)



//router client
routers.use('/auth', authClientRouter)
routers.use('/categories', categoryClientRouter)
routers.use('/authors', authorClientRouter)
routers.use('/series', seriesClientRouter)
routers.use('/banners', bannerClientRoute)
routers.use('/products', clientProductRoute)

export default routers