import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updatecoverImage,
  getuserChannelProfile,
  getUserWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewear.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// SECURED ROUTE
router.route("/logout-User").post(verifyJWT, logoutUser);
router.route("/Refresh-Token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update Account Details").patch(verifyJWT, updateAccountDetails);
router
  .route("/update Avatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatar);
router
  .route("/update Cover Image")
  .patch(verifyJWT, upload.single("coverImage"), updatecoverImage);

router.route("/c/:username").get(verifyJWT, getuserChannelProfile);
router.route("/User History").get(verifyJWT, getUserWatchHistory);

export default router;
