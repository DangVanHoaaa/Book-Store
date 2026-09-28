import env from './config/env.config' // Luôn import đầu tiên để load .env
import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.config'
import { errorConverter, errorHandler } from './middlewares'
// import routers from './routes'

const app: Express = express()


app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 
app.use(cookieParser()) 


app.use(
  cors({
    origin: env.client.url, 
    credentials: true 
  })
)


if (env.server.nodeEnv === 'development') {
  app.use(morgan('dev'))
}


app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🚀 Book Store API Server đang hoạt động bình thường!',
    environment: env.server.nodeEnv
  })
})

// app.use('/api/v1', routers)

app.use(errorConverter) 
app.use(errorHandler) 

connectDB()
  .then(() => {
    app.listen(env.server.port, () => {
      console.log(`=============================================`)
      console.log(` Server đang chạy tại : http://localhost:${env.server.port}`)
      console.log(` Môi trường (NODE_ENV): ${env.server.nodeEnv}`)
      console.log(` Frontend Client URL  : ${env.client.url}`)
      console.log(`=============================================`)
    })
  })
  .catch((error) => {
    console.error(' Khởi động Server thất bại do lỗi kết nối Database:', error)
    process.exit(1)
  })

export default app