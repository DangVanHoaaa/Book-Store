import { Router } from 'express'
import authClientRouter from './client/auth.route'

const routers: Router = Router()

routers.use('/auth', authClientRouter)

export default routers