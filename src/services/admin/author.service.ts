import { authorModel } from "../../models";
import { ApiError } from "../../utils";
import { StatusCodes } from "http-status-codes";
import { authorConstant } from "../../constants";
import redis from "../../config/redis.config";
import { fileURLToPath } from "node:url";

const AUTHOR_KEY = 'authors'

export interface IAuthorInput {
  name: string
  bio?: string
  avatar?: string
  status?: string
}

//get authors
const getAuthors = async(query: any) => {
    const limit = parseInt(query.limit, 10) || 10;
    const cursor = query.cursor
    const keyword  = query.key
    const status = query.status
    const filter: any = {}
    if(cursor){
        filter._id = {$lt: cursor}
    }

    if(keyword){
        filter.keyword = keyword
    }

    if(status){
        filter.status = status
    }

    const authors = await authorModel.find(filter).sort({_id: -1}).limit(limit + 1).lean()
    let hasNextPage = false
    let nextCursor: string | null = null
    if(authors.length > limit){
        hasNextPage = true
        authors.pop()
    }
    if (authors.length > 0) {
        nextCursor = (authors[authors.length - 1] as any)._id.toString()
    }
    return {
        authors,
        pagination: {
            limit,
            hasNextPage,
            nextCursor
        }
  }
}

//get by id
const getAuthorById = async(authorId: string) => {
    const author = await authorModel.findById(authorId)
    if(!author){
        throw new ApiError(StatusCodes.NOT_FOUND,'Tác giả này không tồn tại')
    }
    return author
}

//create author
const createAuthor = async(body: IAuthorInput) => {
    const {name, bio, avatar, status} = body
    const existedAuthor = await authorModel.findOne({name: name.trim()})
    if(existedAuthor){
        throw new ApiError(StatusCodes.BAD_REQUEST,'Tên tác giả này đã tồn tại')
    }

    const newAuthor = await authorModel.create({
        name, bio, avatar, status: status || authorConstant.STATUS.ACTIVE
    })
    await redis.del(AUTHOR_KEY)
    return newAuthor
}

//update author
const updateAuthor = async(authorId: string, body: IAuthorInput) => {
    const {name, bio, avatar, status} = body

    const author = await authorModel.findById(authorId)
    if(!author)
    {
        throw new ApiError(StatusCodes.NOT_FOUND,'Tác giả này không tồn tại')
    }
    const existedAuthor = await authorModel.findOne({
        _id: {$ne: authorId},
        name: name.trim()
    })

    if(existedAuthor){
        throw new ApiError(StatusCodes.BAD_REQUEST,'Tên tác giả này đã tồn tại')
    }

    author.name = name
    if (bio !== undefined) author.bio = bio
    if (avatar !== undefined) author.avatar = avatar
    if (status) author.status = status as any

    await author.save()

    await redis.del(AUTHOR_KEY)
    await redis.del(`authors:${author.slug}`)

    return author
}

const deleteAuthor = async (authorId: string) => {
    const author = await authorModel.findById(authorId)
    if (!author) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Tác giả này không tồn tại.')
    }
    author.status = authorConstant.STATUS.INACTIVE as any
    await author.save()
    
    await redis.del(AUTHOR_KEY)
    await redis.del(`authors:${author.slug}`)
    return true
}

export default {
    getAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
}