import { authorService } from "../../services";
import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync, response, ApiError } from "../../utils";


const getAuthors = catchAsync(async(req: Request, res: Response) => {
    const authors = await authorService.getAuthors(req.query)
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy danh sách tác giả thành công.', authors))
})

const getAuthorBySlug = catchAsync(async(req: Request, res: Response) => {
    const slug  = req.params.slug as string
    const author = await authorService.getAuthorBySlug(slug)

    if (!author) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy tác giả này.')
  }
    res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Lấy thông tin tác giả thành công.', author))
})

export default {
    getAuthors,
    getAuthorBySlug
}