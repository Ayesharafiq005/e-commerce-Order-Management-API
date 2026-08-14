import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';


const addToCart = asyncHandler( async(req , res) => {

    const { productId , quantity } = req.body;
    const userId = req.user._id;

    if(!productId || !quantity || quantity < 1){
        throw new ApiError(400, "Valid product ID and quantity are required");
    }

    const product = await Product.findById(productId);
    if(!product){
        throw new ApiError(400, "Product not found");
    }

    if(product.stock < quantity) {
        throw new ApiError(400, `Only ${product.stock} items in stock`);
    }

    let cart = await Cart.findOne({ owner : userId });

    if(!cart) {
        cart = Cart.create({
            owner : userId,
            items : [{ product : productId , quantity}]
        })
    } else {
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        )

        if(itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity
        } else {
            cart.items.push({ product : productId , quantity });
        }

        await cart.save();
    }

    const updatedCart = await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price stock description",
  });

    return res
        .status(200)
        .json(new ApiResponse(200, cart , "Item added to cart successfully"));
});

const getUserCart = asyncHandler( async( req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ owner : userId }).populate({
        path : 'items.product',
        select : " name price stock description"

    });

    if(!cart) {
        return res
        .status(200)
        .json(new ApiResponse(200, {items : []}, "Cart is empty"))
    }

    return res 
    .status(200)
    .json(new ApiResponse(200, cart , "Cart fetched successfully"));
});

const removeFromCart = asyncHandler( async(req, res) => {
    const { productId } = req.params;;
    const userId = req.user._id;

    const cart = await Cart.findOne({ owner : userId });

    if(!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
    )

    await cart.save();

    return res
        .status(200)
        .json(new ApiResponse (200, cart, "Item removed from cart"));

})

export {
    addToCart,
    removeFromCart,
    getUserCart,
}