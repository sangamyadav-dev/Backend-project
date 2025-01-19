import mongoose, {isValidObjectId} from "mongoose";
import {playList} from "../models/playlist.model";
import {ApiError} from "../utils/ApiError";
import {ApiResponse} from "../utils/ApiResponse";
import {asyncHandler} from "../utils/asyncHandler";

const createPlayList = asyncHandler(async (res, req) =>{
    const {title, description} = req.body
    const newPlayList = new playList({
        title,
        description,
        user: req.user._id
    })
    await newPlayList.save()
    return new ApiResponse(
        res,
        201,
        newPlayList
    )
})

const getUserPlaylists = asyncHandler(async (res, req) =>{
    const playlists = await playList.find({user: req.user._id})
    return new ApiResponse(
        res,
        200,
        playlists
    )
})

const getPlaylistById = asyncHandler(async (res, req) =>{
    const id = req.params.id
    if(!isValidObjectId(id)){
        throw new ApiError(400, 'Invalid id')
    }
    const playlist = await playList.findById(id)
    if(!playlist){
        throw new ApiError(404, 'Playlist not found')
    }
    return new ApiResponse(
        res,
        200,
        playlist
    )
})

const addVideoToPlaylist = asyncHandler(async (res, req) =>{
    const {playListId, videoId} = req.params
    const playlist = await playlist.findById(playListId)
    if(!playList){
        throw new ApiError(
            404,
            'Playlist not found'
        )
    }
    const video = await video.findById(videoId)
    if(!video){
        throw new ApiError(
            404,
            'Video not found'
        )
    }
    playlist.videos.push(videoId)
    await playlist.save()
    return new ApiResponse(
        res,
        200,
        playlist
    )
})

const removeVideoFromPlaylist =asyncHandler(async (res, req) =>{
    const {playListId, videoId} = req.params
    const playList = await playList.findById(playListId)
    if(!playList){
        throw new ApiError(
            404,
            'Playlist not found'
        )
    }
    const videoIndex = playList.videos.indexOf(videoId)
    playList.videos.splice(videoIndex, 1)
    await playList.save()
    return new ApiResponse(
        res,
        200,
        playList
    )
})

const deletePlaylist = asyncHandler(async (res, req) =>{
    const {playListId} =req.params
    const playList = await playList.findById(playListId)
    if(!playList){
        throw new ApiError(
            404,
            'playList not found'
        )
    }
    await playList.remove()
    return new ApiResponse(
        res,
        200,
        {message: 'Playlist deleted'}
    )

})

const updatePlaylist = asyncHandler(async (res, req) =>{
    const {playListId} = req.params
    const {title, description} = req.body
    const playList = await playList.findById(playListId)
    if(!playList){
        throw new ApiError(
            404,
            'Playlist not found'
        )
    }
    playList.title = title
    playList.description = description
    await playList.save()
    return new ApiResponse(
        res,
        200,
        playList
    )

})


export {
    createPlayList,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}