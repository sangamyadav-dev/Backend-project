import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
} from "../controllers/video.controller";

import { verifyJWT } from "../middlewares/auth.middleware";
import { uploadVideo } from "../middlewares/upload.middleware";

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/publish/:videoId").patch(togglePublishStatus);

export default router;