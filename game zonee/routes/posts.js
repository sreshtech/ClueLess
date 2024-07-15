const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController = require('../controllers/posts_controller');
const { uploadPostImage } = require('../config/multerConfig');

router.post('/create', passport.checkAuthentication, uploadPostImage, postController.create);
router.post('/destroy/:id', passport.checkAuthentication, postController.destroy);

module.exports = router;
