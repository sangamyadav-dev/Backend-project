import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"


const verifyJWT = asyncHandler( async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorizationn")?.replace("Bearer", "")

        if(!token){
            throw new ApiError(401, "UnAuthorized Request")
        }

        const decodeToken = jwt.verify (token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodeToken?._id).select(
            "-password -refreshToken"
        )

        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})

export default verifyJWT