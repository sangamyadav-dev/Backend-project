import mongoose from 'mongoose';
import {Comment} from '../models/comment.model';
import {ApiError} from '../utils/ApiError';
import {ApiResponse} from '../utils/ApiResponse';
import {asyncHandler} from  '../utils/asyncHandler';

const getVedioComments = asyncHandler(async (res, req) =>{
    const {vedioId} = req.params
    const {page = 1, limit = 12} = req.query
})

const createComment = asyncHandler(async (res, req) =>{
    const {vedioId} = req.params
    const {comment} = req.body
    const newComment = new Comment({
        vedioId,
        comment,
        user: req.user._id
    })
    await newComment.save()
    return new ApiResponse(res, 201, newComment)
})

const updateComment = asyncHandler(async (res, req)=>{
    const {commentId} = req.params
    const {comment} = req.body
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {comment},
        {new: true}
    )
    if(!updatedComment){
        throw new ApiError(404, 'Comment not found')
    }
    return new ApiResponse(res, 200, updatedComment)
})

const deleteComment = asyncHandler(async (res, req) =>{
    const {commentId} = req.params
    const deleteComment = await Comment.findByIdAndDelete(commentId)
    if(!deleteComment){
        throw new ApiError(404, 'Comment not found')
    }
})

export {
    getVedioComments,
    createComment,
    updateComment,
    deleteComment
}