import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ObjectSchema } from 'joi'
import { response } from '../utils'


type ValidateSchema = {
  body?:   ObjectSchema  
  query?:  ObjectSchema  
  params?: ObjectSchema  
}

const validate = (schema: ValidateSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {

    const parts = Object.keys(schema) as (keyof ValidateSchema)[]

    for (const part of parts) {
      const rule = schema[part]

      const { error } = rule!.validate(req[part], { abortEarly: false })

      if (error) {
        const messages = error.details.map((detail) => detail.message).join(', ')
        return res.status(StatusCodes.BAD_REQUEST).json(
          response(StatusCodes.BAD_REQUEST, messages)
        )
      }
    }
    next()
  }
}

export default validate