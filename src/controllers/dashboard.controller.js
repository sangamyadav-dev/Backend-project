import mongoose from 'mongoose';
import {Vedio} from '../models/vedio.model';
import {subscription} from '../models/subscription.models';
import {like} from '../models/like.models';
import {ApiError} from '../utils/ApiError';
import {ApiResponse} from '../utils/ApiResponse';
import {asyncHandler} from  '../utils/asyncHandler';

// Get the channel stats like total video views, total subscribers, total videos, total likes etc.
const getChannelStats = asyncHandler(async (res, req) =>{
    const {channelId} = req.params
    const totalSubscribers = await subscription
        .find({channelId})
        .countDocuments()

    const totalVideos = await Vedio
        .find({channelId})
        .countDocuments()

    const totalViews = await Vedio
        .find({channelId})
        .sum('views')

    const totalLikes = await like
        .find({
        vedioId: {$in: await Vedio.find({channelId}).distinct('_id')}
        })
        .countDocuments()

    const totalComments = await Vedio
        .find({channelId})
        .sum('comments')

    const totalShares = await Vedio
        .find({channelId})
        .sum('shares')

    return new ApiResponse(res, 200, {
        totalSubscribers,
        totalVideos,
        totalViews,
        totalLikes,
        totalComments,
        totalShares
    })

})

// TODO: Get all the videos uploaded by the channel
const getChannelVideos = asyncHandler(async (res, req) =>{
    try {
        const {channelId} = req.params

        // check if the channel exists
        const channel = await channel.findById(channelId)
        if(!channel){
            throw new ApiError(404, 'channel not found')
        }
        // get all the videos uploaded by the channel
        const videos = await Vedio.find({channelId})
        return new ApiResponse(res, 200, videos)
    }
    catch (error) {
        throw new ApiError(500, error.message)
    }
})

export{
    getChannelStats,
    getChannelVideos
}


