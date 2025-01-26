import { Router } from "express";
import {
    createComment,
    deleteComment,
    updateComment,
    getVedioComments,
} from "../controllers/comment.controller";

import {verifyJWT} from '../middlewares/auth.middleware';

const router = Router();

// Apply verifyJWT middleware to all routes in this file

router.use(verifyJWT);

router.route("/:vedioId", getVedioComments).post(createComment);
router.route("/:commentId").put(updateComment).delete(deleteComment);


export default router;