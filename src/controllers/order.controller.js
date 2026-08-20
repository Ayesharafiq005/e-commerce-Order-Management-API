import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const placeOrder = asyncHandler(async( req,res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ owner : userId }).populate("items.product")

    if(!cart || cart.items.length === 0){
        throw new ApiError(400, "Your cart is empty");
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
        const product = item.product;

        if(!product){
            throw new ApiError(404, "One of the products in your cart no longer exists");
        }

        if(product.stock < item.quantity) {
            throw new ApiError(404 , `Insufficient stock for '${product.name}'. Available: ${product.stock}`);
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
            product : product._id,
            quantity : item.quantity,
           priceAtPurchase: product.price,
        }); 
    }

    const order = await  Order.create({
       customer: userId,
        items : orderItems,
        totalAmount,
        status : "PENDING",
    })

    for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
            $inc: {stock : -item.quantity}
        });
    }

    cart.items = [];
    await cart.save();

    return res
    .status(200)
    .json(new ApiResponse(200, order , "Order placed successfully"));

});

const getUserOrders = asyncHandler( async(req, res) => {
    const userId = req.user._id;

    const orders = await Order.find({ owner : userId })
    .populate("items.product", "name price")
    .sort("-createdAt");

    return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});

const getOrderById = asyncHandler(async(req,res) => {
    const {orderId} = req.params;

    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId , owner : userId }).populate(
        "items.product",
        "name price description"
    )

    if(!order){
        throw new ApiError(400, "Order not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, order, "Order details fetched successfully"));
});

// Admin onlyy
const getAllOrders = asyncHandler( async( req, res) => {
    const orders = await Order.find()
                    .populate("customer", "name email")
                    .populate("items.product", "name price")
                    .sort("-createdAt");

        return res
        .status(200).json(new ApiResponse(200, orders, "All orders retrieved successfully"));
});

// Admin only 
const updateOrderStatus = asyncHandler(async(req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [ "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

    if(!validStatuses.includes(status?.toUpperCase())){
        throw new ApiError(400, "Invalid order status ");
    }

    const order = await Order.findByIdAndUpdate(
        orderId,
        { status : status.toUpperCase()},
        { new : true }
    )

    if(!order) {
        throw new ApiError(404, "Order not found");
    }

    return res
    .status(200)
    .json(new ApiResponse (200, order , `Order status updated to ${status}`));

})


export { placeOrder,
         getOrderById, 
         getUserOrders,
        getAllOrders,
        updateOrderStatus,
        };