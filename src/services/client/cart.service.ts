import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../../utils'
import { cartModel, cartItemModel, productModel } from '../../models'
import { productConstant, cartConstant } from '../../constants'

const getOrCreateCart = async (userId: string) => {
    let cart = await cartModel.findOne({ userId })
    if (!cart) {
        cart = await cartModel.create({ userId })
    }
    return cart
}


const getCart = async (userId: string) => {
    const cart = await getOrCreateCart(userId)

    const items = await cartItemModel
        .find({ cartId: cart._id })
        .populate({
        path: 'productId',
        select: 'title slug images price status variants format authors publisher',
        populate: { path: 'authors', select: 'name slug' }
        })
        .sort({ createdAt: -1 })
        .lean()

    let totalItems = 0
    let totalPrice = 0

    const formattedItems = items.map((item: any) => {
        const itemTotal = item.price * item.quantity
        totalItems += item.quantity
        totalPrice += itemTotal

        return {
        ...item,
        totalPrice: itemTotal
        }
    })

    return {
        cartId: cart._id,
        items: formattedItems,
        totalItems,
        totalPrice
    }
}


const addToCart = async (userId: string, body: { productId: string; variantOption?: string; quantity: number }) => {
    const { productId, variantOption = '', quantity = 1 } = body

    const product = await productModel.findOne({
        _id: productId,
        deleted: false,
        status: productConstant.STATUS.AVAILABLE
    })

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.')
    }

    let itemPrice = product.price
    let stockQuantity = product.quantity

    if (variantOption && product.variants && product.variants.length > 0) {
        const selectedVariant = product.variants.find((v) => v.option === variantOption)
        if (!selectedVariant) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Biến thể "${variantOption}" không tồn tại cho sản phẩm này.`)
        }
        itemPrice = selectedVariant.price
        stockQuantity = selectedVariant.quantity
    }

    const cart = await getOrCreateCart(userId)

    let cartItem = await cartItemModel.findOne({
        cartId: cart._id,
        productId,
        variantOption
    })

    if (cartItem) {
        const newQuantity = cartItem.quantity + quantity

        if (newQuantity > stockQuantity) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Rất tiếc, số lượng trong kho chỉ còn ${stockQuantity} sản phẩm.`)
        }
        if (newQuantity > cartConstant.CART_LIMITS.MAX_QUANTITY_PER_ITEM) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Bạn chỉ được mua tối đa ${cartConstant.CART_LIMITS.MAX_QUANTITY_PER_ITEM} sản phẩm này.`)
        }

        cartItem.quantity = newQuantity
        cartItem.price = itemPrice 
        await cartItem.save()
    } else {
        const currentItemCount = await cartItemModel.countDocuments({ cartId: cart._id })
        if (currentItemCount >= cartConstant.CART_LIMITS.MAX_ITEMS_PER_CART) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Giỏ hàng của bạn đã đạt giới hạn tối đa ${cartConstant.CART_LIMITS.MAX_ITEMS_PER_CART} mặt hàng.`)
        }

        if (quantity > stockQuantity) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Số lượng trong kho chỉ còn ${stockQuantity} sản phẩm.`)
        }

        cartItem = await cartItemModel.create({
            cartId: cart._id,
            productId,
            variantOption,
            quantity,
            price: itemPrice
        })
    }

    return getCart(userId)
}

const updateCartItem = async (userId: string, itemId: string, quantity: number) => {
    const cart = await getOrCreateCart(userId)

    const cartItem = await cartItemModel.findOne({ _id: itemId, cartId: cart._id })
    if (!cartItem) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Mặt hàng này không có trong giỏ hàng của bạn.')
    }

    const product = await productModel.findById(cartItem.productId)
    if (product) {
        let stockQuantity = product.quantity
        if (cartItem.variantOption && product.variants) {
            const v = product.variants.find((item) => item.option === cartItem.variantOption)
            if (v) stockQuantity = v.quantity
        }

        if (quantity > stockQuantity) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Số lượng trong kho chỉ còn ${stockQuantity} sản phẩm.`)
        }
    }

    cartItem.quantity = quantity
    await cartItem.save()

    return getCart(userId)
}

const removeCartItem = async (userId: string, itemId: string) => {
    const cart = await getOrCreateCart(userId)

    const cartItem = await cartItemModel.findOneAndDelete({ _id: itemId, cartId: cart._id })
    if (!cartItem) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Mặt hàng không tồn tại trong giỏ.')
    }
    return getCart(userId)
}


const clearCart = async (userId: string) => {
    const cart = await cartModel.findOne({ userId })
    if (cart) {
        await cartItemModel.deleteMany({ cartId: cart._id })
    }
    return { message: 'Đã dọn dẹp giỏ hàng thành công.' }
}

export default {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
}