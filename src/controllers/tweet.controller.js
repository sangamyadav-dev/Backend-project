import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

 //TODO: create tweet

const createTweet = asyncHandler(async (res, req) =>{
    const {content} = req.body
    const newTweet = new Tweet({
        content,
        owner: req.user._id
    })
    await newTweet.save()
    return new ApiResponse(
        res,
        201,
        newTweet
    )
})

 // TODO: get user tweets

const getUserTweet = asyncHandler(async (res, req) =>{
    const tweets = await Tweet.find({owner: req.user._id})
    return new ApiResponse(
        res,
        200,
        tweets
    )
})

//TODO: update tweet

const updateTweet = asyncHandler(async (res, req) =>{
    const {tweetId} = req.params
    const {content} = req.body
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {content},
        {new: true}
    )
    if(!updatedTweet){
        throw new ApiError(404, 'Tweet not found')
    }
    return new ApiResponse(
        res,
        200,
        updatedTweet
    )
})

 //TODO: delete tweet

const deleteTweet = asyncHandler(async (res, req) =>{
    const {tweetId} = req.params
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
    if(!deletedTweet){
        throw new ApiError(404, 'Tweet not found')
    }
    return new ApiResponse(
        res,
        200,
        {message: 'Tweet deleted'}
    )
})

export {
    createTweet,
    getUserTweet,
    updateTweet,
    deleteTweet
}