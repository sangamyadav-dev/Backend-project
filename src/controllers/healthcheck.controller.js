import {ApiError} from '../utils/ApiError';
import {ApiResponse} from '../utils/ApiResponse';
import {asyncHandler} from '../utils/asyncHandler';

//TODO: build a healthcheck response that simply returns the OK status as json with a message

const healthcheck = asyncHandler(async (res, req) =>{
    return new ApiResponse(
        res,
        200,
        {message: 'OK'}
    )
})