import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const  verifyAdmin = asyncHandler(async(req, _,next) => {

if(req.user?.role !== "ADMIN") {
    throw new ApiError(403, "Access denied : Admin Privileges required");
}
next();

})