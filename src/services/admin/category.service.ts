import { StatusCodes } from "http-status-codes";
import { ApiError, buildTree } from "../../utils";
import { categoryModel } from "../../models";
import { categoryConstant } from "../../constants";
import redis from "../../config/redis.config";
import { STATUS_CODES } from "node:http";

const CATEGORY_KEY = 'categories'
export interface ICategoryInput {
    name: string
    parentId?: string | null
    description?: string
    status?: string
}

//get category 
const getCategories = async (query: any) => {
    const limit = parseInt(query.limit, 10) || 10;
    const cursor = query.cursor
    const keyword = query.keyword || query.key || query.search
    const status = query.status
    const filter: any = {}
   
    if (cursor) {
        filter._id = { $lt: cursor }
    }
    if (keyword) {
        filter.name = new RegExp(keyword, 'i')
    }
    
    if (status) {
        filter.status = status
    }

    const categories = await categoryModel.find(filter).sort({ _id: -1 }).limit(limit + 1).populate('parentId', 'name slug').lean()
    let hasNextPage = false
    let nextCursor: string | null = null
    if (categories.length > limit) {
        hasNextPage = true
        categories.pop()
    }
    if (categories.length > 0) {
        nextCursor = (categories[categories.length - 1] as any)._id.toString()
    }
    return {
        categories,
        pagination: {
        limit,
        hasNextPage,
        nextCursor
        }
    }
}

//get category by id
const getCategoryById = async (categoryId: string) => {
  const category = await categoryModel.findById(categoryId).populate('parentId', 'name slug')
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Danh mục này không tồn tại.')
  }
  return category
}

// create category
const createCategory = async(body: ICategoryInput) =>{
    const { name, parentId, description, status } = body
    if(parentId)
    {
        const parent = await categoryModel.findById(parentId)
        if(!parent)
        {
            throw new ApiError(StatusCodes.BAD_REQUEST,'Danh mục cha không tồn tại')
        }
    }
    const existedCategory = await categoryModel.findOne({name: name.trim()})
    if(existedCategory)
    {
        throw new ApiError(StatusCodes.BAD_REQUEST,'Tên danh mục này đã tồn tại')
    }

    const newCategory = await categoryModel.create({
        name: name,
        parentId: parentId || null,
        description: description,
        status: status || categoryConstant.STATUS.ACTIVE
    })

    redis.del(CATEGORY_KEY)

    return newCategory
}

// update category
const updateCategory = async( categoryId: string, body: ICategoryInput) => {
    const { name, parentId,description,status } = body
    const category = await categoryModel.findById(categoryId)
    if(!category)
    {
        throw new ApiError(StatusCodes.NOT_FOUND,'Danh mục này không tồn tại')
    }
    if(parentId && parentId === categoryId)
    {
        throw new ApiError(StatusCodes.BAD_REQUEST,'Danh mục cha không được là chính nó')
    }

    if(parentId)
    {
        const parent = await categoryModel.findById(parentId)
        if(!parent)
        {
            throw new ApiError(StatusCodes.BAD_REQUEST,'Danh mục cha không tồn tại')
        }
    }
    const existedCategory = await categoryModel.findOne({
        _id: {$ne: categoryId},
        name: name.trim()
    })
    if(existedCategory)
    {
        throw new ApiError(StatusCodes.BAD_REQUEST,'Tên danh mục này đã bị trùng')
    }
    category.name = name
    category.parentId = parentId ? (parentId as any) : null
    if (description !== undefined) category.description = description
    if (status) category.status = status as any

     await category.save()
    await redis.del(CATEGORY_KEY)
    return category
}


const deleteCategory = async (categoryId: string) => {
    const category = await categoryModel.findById(categoryId)
    if (!category) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Danh mục này không tồn tại.')
    }
    category.status = categoryConstant.STATUS.INACTIVE as any
    await category.save()
    await redis.del(CATEGORY_KEY)
    return true
}

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}
