import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createProduct = asyncHandler(async (req,res) => {
    const { name , description , price , stock , categoryId } = req.body ;

    if(!name || !price || !categoryId){
        throw new ApiError (400, "Name, price, and category are required");
    }

    const categoryExists = await Category.findById(categoryId);

    if(!categoryId) {
        throw new ApiError(400, "Category not found")
    }

    const product = await Product.create({
        name ,
        description : description || "",
        price ,
        stock : stock || 0,
        categoryId : categoryId
    });

    res
    .status(200)
    .json(new ApiResponse(200, "Product created successfully"))
});


export { 
    createProduct,
}