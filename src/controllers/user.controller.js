import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.models.js'
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser =  asyncHandler ( async (req, res) =>{

    const {fullName, username, email, password} = res.body
    if (
        [fullName, username, email, password].some((field) =>
        field?.trim() === " ")
    ){
        throw new ApiError(400, "All fields are Required")
    }

    // check if user already exist
    const isUserAlreadyExist = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (isUserAlreadyExist){
        throw new ApiError(400, "User Already Exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverPhoto[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is Required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(! avatar ){
        throw new ApiError(400, "Avatar is Required")
    }

    const user = await User.create ({
        fullName,
        username,
        email,
        password,
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || ""
    })
    const createUserFind = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(! createUserFind){
        throw new ApiError(500, "Something went to wrong while regstering user.")
    }

    return res.status(201).json(
        new ApiResponse(201, createUserFind, "User Created Successfully")
    )
})

export {registerUser}