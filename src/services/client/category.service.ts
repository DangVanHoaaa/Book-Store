import { categoryModel } from '../../models'
import { categoryConstant } from '../../constants'
import { buildTree } from '../../utils'
import redis from '../../config/redis.config'

const CATEGORY_KEY = 'categories'
const getCategoryTree = async () => {
    const cachedTree = await redis.get(CATEGORY_KEY)
    if (cachedTree) {
        return JSON.parse(cachedTree)
    }

    const categories = await categoryModel
        .find({ status: categoryConstant.STATUS.ACTIVE })
        .sort({ createdAt: -1 })
        .lean()

    const categoryTree = buildTree(categories)
    await redis.setex(CATEGORY_KEY, 3600, JSON.stringify(categoryTree))

    return categoryTree
    }

export default {
    getCategoryTree
}