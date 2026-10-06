import { Request, Response } from 'express'
import { catchAsync, response } from '../../utils'
import productService from '../../services/admin/product.service'
import { StatusCodes } from 'http-status-codes'


const getProducts = catchAsync(async (req: Request, res: Response) => {
    const result = await productService.getProducts(req.query)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách sản phẩm thành công', result))
})


const getProductById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const productId  = req.params.productId as string
    const product = await productService.getProductById(productId)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy thông tin sản phẩm thành công', product))
})


const createProduct = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const product = await productService.createProduct(req.body)
    res.status(StatusCodes.CREATED).json(response(StatusCodes.CREATED, 'Tạo sản phẩm mới thành công', product))
})


const updateProduct = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const productId  = req.params.productId as string
    const product = await productService.updateProduct(productId, req.body)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Cập nhật sản phẩm thành công', product))
})


const deleteProduct = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const productId  = req.params.productId as string
    await productService.deleteProduct(productId)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Xóa sản phẩm thành công'))
})

export default {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}