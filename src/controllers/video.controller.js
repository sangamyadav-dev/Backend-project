import mongoose, { isValidObjectId } from 'mongoose';
import { Video } from '../models/video.model';
import { User } from '../models/user.models';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { uploadOnCloudinary } from '../utils/cloudnary';


//TODO: get all videos based on query, sort, pagination
const getAllVideos = asyncHandler(async (req, res) =>{
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const match = {}
    if(query){
        match.title = query
    }
    if(userId){
        match.user = userId
    }
    const videos = await Video
        .find(match)
        .sort({[sortBy]: sortType})
        .skip((page - 1) * limit)
        .limit(limit)
    return new ApiResponse(
        res,
        200,
        videos
    )
})

// TODO: get video, upload to cloudinary, create video
const publishAVideo = asyncHandler(async (req, res) =>{
    const {title, description} = req.body
    const {user} = req
    const {file} = req
    const uploadedVideo = await uploadOnCloudinary(file)
    const newVideo = new Video({
        title,
        description,
        user: user._id,
        videoUrl: uploadedVideo.url
    })
    await newVideo.save()
    return new ApiResponse(
        res,
        201,
        newVideo
    )
})

   //TODO: update video details like title, description, thumbnail
const updateVideo = asyncHandler(async (req, res) =>{
    const {videoId} = req.params
    const {title, description} = req.body
    const updateVideo = await Video.findByIdAndUpdate
    (videoId,
        {title, description},
        {new: true}
    )
    if(!updateVideo){
        throw new ApiError(
            404,
            'Video not found'
        )
    }
    return new ApiResponse(
        res,
        200,
        updateVideo
    )
})

// TODO : delete video
const deleteVideo = asyncHandler(async (req, res) =>{
    const {videoId} = req.params
    const deleteVideo = await Video.findByIdAndDelete(videoId)
    if(!deleteVideo){
        throw new ApiError(
            404,
            'Video not found'
        )
    }
    return new ApiResponse(
        res,
        200,
        {message: 'Video deleted'}
    )
})

const togglePublishStatus = asyncHandler(async (req, res) =>{
    const {videoId} = req.params
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, 'Video not found')
    }
    video.published = !video.published
    await video.save()
    return new ApiResponse(
        res,
        200,
        video
    )
})

export{
    getAllVideos,
    publishAVideo,

}