import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminCategoryService } from "../../services";
import { catchAsync, response } from "../../utils";

const getCategoryTree = catchAsync(async ( req: Request, res: Response) => {
    const categoryTree= await adminCategoryService.getCategories(req.query)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách danh mục thành công.', categoryTree))
})

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
    const categoryId = req.params.categoryId as string
    const category = await adminCategoryService.getCategoryById(categoryId)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy cây danh mục thành công.', category))
})

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const newCategory = await adminCategoryService.createCategory(req.body)
    res.status(StatusCodes.CREATED).json(response(StatusCodes.CREATED, 'Tạo danh mục thành công.', newCategory))
})
const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const categoryId  = req.params.categoryId as string
    const updated = await adminCategoryService.updateCategory(categoryId, req.body)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Sửa danh mục thành công.', updated))
})
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const categoryId  = req.params.categoryId as string
    await adminCategoryService.deleteCategory(categoryId)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Xóa danh mục thành công.'))
})
export default {
    getCategoryTree,
    getCategoryById, 
    createCategory,
    deleteCategory,
    updateCategory
}