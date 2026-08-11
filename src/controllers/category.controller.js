import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createCategory = asyncHandler (async (req ,res) => {
    const { name , description } = req.body ;

    if(!name ) {
        throw new ApiError(400, "Category name is required");
    }

    const existingCategory = await Category.findOne({ name });

    if(existingCategory) {
        throw new ApiError(400, "Category with this name already exists");
    }

    const category = await Category.create({
        name ,
        description : description || ""
    })

    return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));

});




export {
    createCategory
}