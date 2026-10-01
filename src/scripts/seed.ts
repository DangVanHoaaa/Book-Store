import mongoose from 'mongoose'
import env from '../config/env.config'
import { permissionModel, roleModel, userModel } from '../models'
import { permissionConstant, roleConstant, userConstant } from '../constants'


const modules = ['product', 'category', 'author', 'series', 'banner', 'order', 'role']
const actions = ['get', 'create', 'update', 'delete']

const seed = async () => {
  try {
  
    await mongoose.connect(env.db.mongoUri)
    console.log(' Đã kết nối DB để seed dữ liệu...')

 
    for (const moduleName of modules) {
    for (const actionName of actions) {
        await permissionModel.findOneAndUpdate(
        { module: moduleName, action: actionName },
        {
            code: `${moduleName}_${actionName}`, 
            name: `${actionName.toUpperCase()} ${moduleName.toUpperCase()}`,
            module: moduleName,
            action: actionName,
            status: permissionConstant.STATUS.ACTIVE
        },
        { upsert: true, returnDocument: 'after' }
        )
    }
    }
    console.log(' 1. Đã khởi tạo thành công 28 Permissions!')

 
    const allPermissions = await permissionModel.find({ status: permissionConstant.STATUS.ACTIVE })
    const allPermissionIds = allPermissions.map((p) => p._id)

   
    const superAdminRole = await roleModel.findOneAndUpdate(
      { slug: roleConstant.ROLE_SLUG.SUPER_ADMIN },
      {
        name: 'Super Admin',
        description: 'Quản trị viên tối cao có toàn quyền hệ thống',
        slug: roleConstant.ROLE_SLUG.SUPER_ADMIN,
        permissions: allPermissionIds,
        status: roleConstant.STATUS.ACTIVE,
        isSystem: true
      },
      { upsert: true, new: true }
    )

    await roleModel.findOneAndUpdate(
      { slug: roleConstant.ROLE_SLUG.USER },
      {
        name: 'User',
        description: 'Khách hàng mua sách mặc định',
        slug: roleConstant.ROLE_SLUG.USER,
        permissions: [],
        status: roleConstant.STATUS.ACTIVE,
        isSystem: true
      },
      { upsert: true, new: true }
    )
    console.log(' 2. Đã khởi tạo 2 Roles: Super Admin & User!')

  
    const adminEmail = 'admin@gmail.com'
    const existingAdmin = await userModel.findOne({ email: adminEmail })

    if (!existingAdmin) {
      await userModel.create({
        fullname: 'Super Admin',
        email: adminEmail,
        password: 'admin123',
        roleId: superAdminRole._id,
        status: userConstant.STATUS.ACTIVE,
        isVerified: true
      })
      console.log('3. Đã tạo thành công Tài khoản Admin (admin@gmail.com / admin123)!')
    } else {
      existingAdmin.roleId = superAdminRole._id as any
      await existingAdmin.save()
      console.log(' Tài khoản Admin đã tồn tại. Đã cập nhật roleId Super Admin.')
    }

    console.log('🎉 TOÀN BỘ DỮ LIỆU SEED ĐÃ HOÀN THÀNH RỰC RỠ!')
    process.exit(0)
  } catch (error) {
    console.error(' Lỗi Seeder:', error)
    process.exit(1)
  }
}

// Chạy hàm seed
seed()