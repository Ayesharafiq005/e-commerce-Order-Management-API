import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// const registerUser = asyncHandler( async( req , res) => {
//     const { name , email, password , role} = req.body ;

//     if(!name || !email || !password) {
//         throw new ApiError(400, "Name, email, and password are required");
//     }

//     const existingUser = await User.findOne({ email : email.toLowerCase() });
//     if(existingUser) {
//         throw new ApiError(400, "User with this email already exists ");
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     const user = await User.create({
//         name,
//         email : email.toLowerCase(),
//         password : hashedPassword,
//         role : role || "CUSTOMER"
//     })

//     const createdUser = await User.findById(user._id).select("-password");

//     return res
//     .status(200)
//     .json(new ApiResponse , createdUser , "User registered successfully");
// })

// const loginUser = asyncHandler( async(req, res) => {
//     const { email , password} = req.body;

//     if(!email || ! password) {
//         throw new ApiError(400, "Email and password are required");
//     }

//     const user = await User.findOne({ email : email.toLowerCase() });
//     if(!user) {
//         throw new ApiError(404, "User does not exist");
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if(!isPasswordValid) {
//         throw new ApiError(400 , "INVALID user credentials")
//     }

//     const accessToken = jwt.sign({
//         id : user._id,
//         email : user.email,
//         role : user.role,  
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn : "1d"}
// )

// const loggedInUser = await User.findById(user._id).select("-password");

// return res 
// .status(200)
// .json(new ApiResponse(200, {user : loggedInUser, accessToken}, "User logged in successfully"));


// })

const generateAccessAndRefreshTokens = async (userId) => {
        try {
            
            const user = await User.findById(userId);
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave : false });
            
            return { refreshToken, accessToken}

        } catch (error) {
            console.log("Token Generation Error:", error);
            throw new ApiError(
                500, 
                "Something went wrong while generating access and refresh tokens"
            )
        }
    };

      const options = {
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
        }

        
    const registerUser = asyncHandler(async (req, res) => {
        const { name, email, password, role } = req.body;

        if([name, email, password].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

   const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }


  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || "CUSTOMER",
  });

  const createdUser = await User.findById(user._id).select("-password -refreshtoken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));

    });


 const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshtoken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});




export { registerUser , loginUser }