import mongoose, {isValidObjectId} from "mongoose";
import {User} from '../models/user.models';
import {subsciption, Subscription} from '../models/subscription.models';
import {ApiError} from '../utils/ApiError';
import {ApiResponse} from '../utils/ApiResponse';
import {asyncHandler} from '../utils/asyncHandler';

// TODO: toggle subscription to a channel
const toggleSubscription = asyncHandler(async (res, req) =>{
    const {id} = req.params;
    const {user} = req;
    const existingSubscription = await Subscription.findOne(
        {
            channel: id,
            user: user._id
        }
    );
    if (!existingSubscription) {
        const newSubscription = new Subscription(
            {
                channel: id,
                user: user._id
            }
        );
        await newSubscription.save();
        return new ApiResponse(
            res,
            201,
            newSubscription
        );
    }
    await Subscription.findByIdAndDelete(existingSubscription._id);
    return new ApiResponse(
        res,
        200,
        {message: "Subscription removed"}
    );
})

// controller to return subscriber list of a channel

const getUserChannelSubscribers = asyncHandler(async (res, req) =>{
    const {id} = req.params;
    const subscribers = await User.find(
        {
            subscribers: id
        }
    );
    return new ApiResponse(
        res,
        200,
        subscribers
    );
})

// controller to return channel list to which user has subscribed

const getSubscribedChannels = asyncHandler(async (res, req) =>{
    const {id} = req.params;
    const subscriptions = await subsciption.find(
        {
            user: id
        }
    )
    return new ApiResponse(
        res,
        200,
        subscriptions
    )
})


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels

}
