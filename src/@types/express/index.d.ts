import { IUser } from '../../models/user.model'
import { IPermission } from '../../models/permission.model'
import { IRole } from '../../models/role.model'

type PopulatedPermission = {
  code: string
}

type PopulatedRole = IRole & {
  permissions: PopulatedPermission[]
}

export interface IUserAuth extends Omit<IUser, 'roleId'> {
  _id: any
  roleId: PopulatedRole | null
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserAuth
    }
  }
}