import { Router } from 'express';

import {
    createPlayList,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
} from '../controllers/playlist.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/').post(createPlayList);
router.route('/:playListId')
    .get(getPlaylistById)
    .put(updatePlaylist)
    .delete(deletePlaylist);
router.route('/add/:videoId/:playListId').patch(addVideoToPlaylist);
router.route('/remove/:videoId/:playListId').patch(removeVideoFromPlaylist);

router.route('/user/:userId').get(getUserPlaylists);

export default router;
