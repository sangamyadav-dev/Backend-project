import { Router } from 'express';

import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideosLike,
    toggleTweetLike,
} from '../controllers/like.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route('/videos').get(getLikedVideos);
router.route('/videos/:videoId').post(toggleVideosLike);
router.route('/comments/:commentId').post(toggleCommentLike);
router.route('/tweets/:tweetId').post(toggleTweetLike);

export default router;

