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


const getAllProducts = asyncHandler(async (req,res) => {

const {
    page = 1,
    limit = 10,
    query,
    category,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc"
} = req.query;

const filter = {};

if(query){
    filter.$or = [
        {name : {$regex : query , $options :  "i" } },
        { description : {$regex: query , $options : "i" }}
    ]
}

if(category){
    filter.category = category
}

if(minPrice || maxPrice) {
    filter.price = {}
    if(minPrice) filter.price.$gte = Number(minPrice);
    if(maxPrice) filter.price.$gte = Number(maxPrice);
}

const pageNum = Math.max(1, parseInt(page, 10));
const limitNum = Math.max(1, parseInt(limit, 10));
const skip = (pageNum - 1) * limitNum;
const sortDirection  = sortOrder === "asc" ? 1 : -1;

const sortOptions = {};
sortOptions[sortBy] = sortDirection;

const [ products , totalProducts] = await Promise.all([
    Product.find(filter)
    .populate("categoryId" , "name")
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum),
    Product.countDocuments(filter)
]);

const totalPages = Math.ceil(totalProducts / limitNum);

return res.status(200).json(
    new ApiResponse (200,
       {
        products,
        pagination : {
            totalProducts,
            totalPages,
            currentPage : pageNum,
            limit : limitNum ,
            hasNextPage : pageNum < totalPages,
            hasPrevPage : pageNum > 1
        }
       },
       "Products retrieved successfully"
    )
)


})

export { 
    getAllProducts,
    createProduct,
}