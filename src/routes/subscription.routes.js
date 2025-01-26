import { Router } from "express";
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
} from "../controllers/subscription.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route("/c/:channelId")
    .get(getSubscribedChannels)
    .post(toggleSubscription);

router.route("/subscribers/:channelId").get(getUserChannelSubscribers);

export default router;
