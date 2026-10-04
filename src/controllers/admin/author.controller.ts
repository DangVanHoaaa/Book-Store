import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { adminAuthorService } from '../../services'
import { response, catchAsync } from '../../utils'


const getAuthors = catchAsync(async (req: Request, res: Response) => {
    const result = await adminAuthorService.getAuthors(req.query)

    res.status(StatusCodes.OK).json(
        response(StatusCodes.OK, 'Lấy danh sách tác giả thành công.', result)
    )
})


const getAuthorById = catchAsync(async (req: Request, res: Response) => {
    const authorId  = req.params.authorId as string
    const author = await adminAuthorService.getAuthorById(authorId)

    res.status(StatusCodes.OK).json(
        response(StatusCodes.OK, 'Lấy thông tin tác giả thành công.', author)
    )
})


const createAuthor = catchAsync(async (req: Request, res: Response) => {
    const newAuthor = await adminAuthorService.createAuthor(req.body)

    res.status(StatusCodes.CREATED).json(
        response(StatusCodes.CREATED, 'Tạo tác giả mới thành công.', newAuthor)
    )
})


const updateAuthor = catchAsync(async (req: Request, res: Response) => {
    const authorId  = req.params.authorId as string
    const updatedAuthor = await adminAuthorService.updateAuthor(authorId, req.body)

    res.status(StatusCodes.OK).json(
        response(StatusCodes.OK, 'Cập nhật tác giả thành công.', updatedAuthor)
    )
})


const deleteAuthor = catchAsync(async (req: Request, res: Response) => {
    const authorId  = req.params.authorId as string
    await adminAuthorService.deleteAuthor(authorId)

    res.status(StatusCodes.OK).json(
        response(StatusCodes.OK, 'Xóa tác giả thành công.')
    )
})

export default {
    getAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
}