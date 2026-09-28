import mongoose, { Schema, model } from 'mongoose'
import { permissionConstant } from '../constants'

export interface IPermission {
  code: string
  name: string
  module: string
  action: string
  status: string
  position: number
}

const permissionSchema = new Schema<IPermission>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    name: {
      type: String,
      required: true
    },

    module: {
      type: String,
      enum: permissionConstant.PERMISSIONMODULE,
      required: true
    },

    action: {
      type: String,
      enum: permissionConstant.PERMISSIONACTION,
      required: true
    },

    status: {
      type: String,
      enum: permissionConstant.STATUS,
      default: permissionConstant.STATUS.ACTIVE,
      index: true
    },

    position: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

permissionSchema.pre('validate', function () {
  if (!this.code) {
    this.code = this.module + '_' + this.action
  }
})


permissionSchema.pre('validate', async function () {
  if (this.isNew) {
    const maxPermission = await mongoose
      .model<IPermission>('Permission')
      .findOne()
      .sort({ position: -1 })
      .select('position')

    if (maxPermission) {
      this.position = maxPermission.position + 1
    } else {
      this.position = 1
    }
  }
})

export default model<IPermission>('Permission', permissionSchema)

