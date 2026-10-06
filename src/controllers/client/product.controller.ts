import { Request, Response } from 'express'
import { catchAsync, response } from '../../utils'
import { productService } from '../../services'
import { StatusCodes } from 'http-status-codes'

const getProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getProducts(req.query)
  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách sản phẩm thành công', result))
})

const getProductBySlug = catchAsync(async (req: Request, res: Response)=> {
  const slug = req.params.slug as string
  const product = await productService.getProductBySlug(slug)
  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy chi tiết sản phẩm thành công', product))
})

export default {
  getProducts,
  getProductBySlug
}