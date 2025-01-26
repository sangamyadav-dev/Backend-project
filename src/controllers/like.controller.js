import mongoose, { isValidObjectId } from "mongoose";
import { like } from "../models/like.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const toggleVideosLike = asyncHandler(async (res, req) => {
  const { videoId } = req.params;
  const { user } = req;
  const existingLike = await like.findOne(
    { videoId, user: user._id }
  );
  if (!existingLike) {
    const newLike = new like(
      { videoId,
        user: user._id
      }
    );
    await newLike.save();
    return new ApiResponse(
      res,
      201,
      newLike
    );
  }
  await like.findByIdAndDelete(existingLike._id);
  return new ApiResponse(res, 200, { message: "Like removed" });
});

const toggleCommentLike = asyncHandler(async (res, req) => {
  const { commentId } = req.params;
  const { user } = req;
  const existingLike = await like.findOne(
    { commentId, user: user._id }
);
  if (!existingLike) {
    const newLike = new like(
        { commentId, user: user._id }
    );
    await newLike.save();
    return new ApiResponse(
        res,
        201,
        newLike
    );
  }
  await like.findByIdAndDelete(existingLike._id);
  return new ApiResponse(
    res,
    200,
    { message: "Like removed" });
});

const toggleTweetLike = asyncHandler(async (res, req) => {
  const { tweetid } = req.params;
  const { user } = req;
  const existingLike = await like.findOne(
    { tweetid, user: user._id }
);
  if (!existingLike) {
    const newLike = new like(
        { tweetid, user: user._id }
    );
    await newLike.save();
    return new ApiResponse(
        res,
        201,
        newLike
    );
  }
});

const getLikedVideos = asyncHandler(async (res, req) => {
  const { user } = req;
  const likedVideos = await like
    .find({
      user: user._id,
      videoId: { $exists: true },
    })
    .populate("videoId");
    return new ApiResponse(
    res,
    200,
    likedVideos
);
});

export {
  toggleVideosLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
};
