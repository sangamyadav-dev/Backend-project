import mongoose, {isValidObjectId} from "mongoose";
import {User} from '../models/user.models';
import {Subscription} from '../models/subscription.models';
import {ApiError} from '../utils/ApiError';
import {ApiResponse} from '../utils/ApiResponse';
import {asyncHandler} from '../utils/asyncHandler';

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

export {
    toggleSubscription
}
