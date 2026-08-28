const express = require('express');
const { uploadImages, deleteImage } = require('../controllers/upload.controller');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();
router.use(protect);

router.post('/', upload.array('images', 8), uploadImages);
router.delete('/:publicId', deleteImage);

module.exports = router;
