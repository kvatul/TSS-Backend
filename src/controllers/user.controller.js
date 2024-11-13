import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessTokenAndRefesshToken = async (userId) => { 
  try {
   const user=await User.findById(userId) 
   
   console.log('actoken', process.env.ACCESS_TOKEN_SECRET, 'exp in', process.env.ACCESS_TOKEN_EXPIRY)
    
    
   const accessToken =  user.generateAccessToken()
   //console.log('acsT',accessToken)
    const refreshToken = user.generateRefreshToken()

   console.log('accessToken,refreshToken',accessToken,refreshToken) 
   
    user.refreshToken = refreshToken
   await user.save({ validateBeforeSave: false })
   return {accessToken,refreshToken}
 } catch (error) {
   throw new ApiResponse(500,"something went wrong while generating Access and Refresh Tokens ")
 }
}



const registerUser = asyncHandler(async (req, res) => {
 
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
  
    const { username, email, fullName, password } = req.body
    //console.log("req.body",req.body)  
  
    if ([username, email, fullName, password].some((field) => (field?.trim() === "")))
            throw new ApiError(400, "All fields are required")
    
    
    const userExist= await User.findOne({
            $or: [{ username }, { email }]
    })
    //console.log(userExist)
    if (userExist)
        throw new ApiError(409, "User with username or Email already exist")
    //console.log(req)
    //console.log("files",req.files)


    const avatarImagePath = req.files?.avatar[0]?.path
    //  const coverImagePath = req.files?.coverImage[0]?.path
    let coverImagePath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImagePath = req.files.coverImage[0].path
    }
  
    if (!avatarImagePath)
       throw new ApiError(402, "Avatar file is required")  
    
    const avatar=await uploadCloudinary(avatarImagePath)
    const coverImage = await uploadCloudinary(coverImagePath)
    
   const user= await User.create({
        fullName,
        username:username,
        email,
        password,
        avatar:avatar?.url || null,
        coverImage:coverImage?.url || null
    })
    
    const userCreated=await User.findById(user._id).select("-password -refreshToken")

    if (!userCreated) 
      throw new ApiError(500, "Failed during creating User at Server side")  

   return res.status(200).json( new ApiResponse(200, userCreated, "User created successfully"))

   
})
 
const loginUser = asyncHandler(async (req, res) => {
  // request body - username,email, password
  // check either username or email present
  // then password should not empty and verify it with Data
  
  const { username, password, email } = req.body

  if (!username && !email) 
    throw new ApiError(202, "Either username or email mandatory") 
  
  const user = await User.findOne({ $or: [{ username }, { email }] })
  
  if (!user) 
    throw new ApiError(202, "User Not found") 
  

  if (!password) 
    throw new ApiError(202, "Password can not be empty") 

  const isPasswordOk= await user.isPasswordCorrect(password)

  if (!isPasswordOk)
    throw new ApiError(202, "Invalid User credential")


  const { accessToken, refreshToken } = await generateAccessTokenAndRefesshToken(user._id)
  const userLogged =  await User.findById(user._id).select("-password -refreshToken") // await User.findById(userExist._id).select("-password -refreshToken")
  //const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure:true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse({user:userLogged,accessToken,refreshToken},"User Logged in successfully")
    )

})


const logoutUser = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true}
  )

  const options = {
    httpOnly: true,
    secure:true
  }

  return res.status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
  
 })


export { registerUser,loginUser,logoutUser}


