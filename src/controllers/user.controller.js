import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
// import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshTokens = async(userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateATS()
    const refreshToken = user.generateRTS()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false})
    return {accessToken, refreshToken}
  } catch (error) {
    throw new ApiError(500, "something went to wrong while generate Refresh and Access Token")
  }
}
// USER REGISTER
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;
  // console.log('email:', email)
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are Required");
  }

  // check if user already exist
  const isUserAlreadyExist = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (isUserAlreadyExist) {
    throw new ApiError(409, "Username & email Already Exist");
  }
  // console.log(req.files);

  // Check if avatar and cover image are provided
  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // let coverImageLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar files is Required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // if (!avatar) {
  //   throw new ApiError(400, "Avatar files is Required");
  // }

  const user = await User.create({
    fullName,
    email,
    password,
    username,
    // avatar: avatar?.url,
    // coverImage: coverImage?.url || "",
  })

  const createUserFind = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createUserFind) {
    throw new ApiError(500, "Something went to wrong while regstering user.");
  }

  return res.status(201).json(
    new ApiResponse(201, createUserFind, "User Created Successfully"));
})

//  USER LOGIN
const loginUser = asyncHandler(async (req, res) =>{

    const {username, email, password } = req.body

    if (!username && !email){
        throw new ApiError(400, "email and password Required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password");
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshTokens(user._id)

    const loggedinUser = await User.findById(user._id).select("-password -refreshToken")

    const options ={
      httpOnly: true,
      secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,{
          user: loggedinUser, refreshToken, accessToken
        },
        "user logged In Success"
      )
    )
})

// LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User LoggedOut Successfully"))
})

const refreshAccessToken = ( async (req, res) =>{
  const upcomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if(!upcomingRefreshToken){
    throw new ApiError(401, "UnAuthrozie Refresh Token")
  }

  try {
    const decodedRefToken = jwt.verify(
      upcomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedRefToken?._id)
    if(!user){
      throw new ApiError(401, "Invalid Refresh Token")
    }

    if (upcomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is Already Expired & used")
    }

    const options = {
      httpOnly: true,
      secure : true
    }

    const {accessToken, NewRefreshToken} = await generateAccessTokenAndRefreshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", NewRefreshToken, options)
      .json(new ApiResponse(200, {accessToken, refreshToken: NewRefreshToken},
        "Access Token Refreshed Successfully"))
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token")
  }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
  };