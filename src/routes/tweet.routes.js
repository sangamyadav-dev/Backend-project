import { Router }  from 'express';
import {
    createTweet,
    getUserTweet,
    updateTweet,
    deleteTweet,
} from '../controllers/tweet.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply verifyJWT middleware to all routes in this file

router.use(verifyJWT);

router.route('/').post(createTweet);
router.route('/:tweetId').get(getUserTweet).put(updateTweet).delete(deleteTweet);

export default router;