const multer = require('multer');
const path = require('path');

const POST_IMAGE_PATH = path.join('/uploads/posts/images');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', POST_IMAGE_PATH));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadPostImage = multer({ storage: storage }).single('image');
const postImagePath = POST_IMAGE_PATH;

module.exports = {
    uploadPostImage,
    postImagePath
};
