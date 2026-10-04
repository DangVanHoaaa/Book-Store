import { authorConstant } from "../../constants";
import { authorModel } from "../../models";
import redis from "../../config/redis.config";


const AUTHOR_KEY = 'authors'

const getAuthors = async(query: any) => {
    const limit = parseInt(query.limit, 10) || 10;
    const cursor = query.cursor

     if (!cursor) {
    const cachedAuthors = await redis.get(AUTHOR_KEY)
    if (cachedAuthors) {
      return JSON.parse(cachedAuthors)
    }
    }
    const filter: any = {status: authorConstant.STATUS.ACTIVE}
    if(cursor)
    {
        filter._id = {$lt: cursor}

    }


    const authors = await authorModel.find(filter).sort({_id: -1}).limit(limit + 1).lean()
    let hasNextPage = false
    let nextCursor: string | null = null

    if(authors.length > limit){
        hasNextPage = true
        authors.pop()
    }
    if(authors.length > 0)
    {
        nextCursor = (authors[authors.length - 1] as any)._id.toString()
    }
    const result = {
        authors,
        pagination: {
            limit,
            hasNextPage,
            nextCursor
        }
  }
    if (!cursor) {
        await redis.setex(AUTHOR_KEY, 3600, JSON.stringify(result))
    }
    return result
}

const getAuthorBySlug = async (slug: string) => {
  const cacheKey = `authors:${slug}`
  const cachedAuthor = await redis.get(cacheKey)
  if (cachedAuthor) {
    return JSON.parse(cachedAuthor)
  }
  const author = await authorModel.findOne({slug,status: authorConstant.STATUS.ACTIVE}).lean()
  if (author) {
    await redis.setex(cacheKey, 3600, JSON.stringify(author))
  }
  return author
}

export default {
  getAuthors,
  getAuthorBySlug
}
