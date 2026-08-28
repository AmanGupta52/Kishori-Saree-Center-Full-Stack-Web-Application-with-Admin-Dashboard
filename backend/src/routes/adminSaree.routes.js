const express = require('express');
const {
  getAdminSarees,
  createSaree,
  updateSaree,
  addSareeImages,
  deleteSareeImage,
  setMainImage,
  replaceSareeImage,
  deleteSaree,
  duplicateSaree,
  previewPrice,
} = require('../controllers/saree.controller');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect); // everything below requires admin login

router.get('/', getAdminSarees);
router.post('/', upload.array('images', 8), createSaree);
router.post('/preview-price', previewPrice);

router.put('/:id', updateSaree);
router.delete('/:id', deleteSaree);
router.post('/:id/duplicate', duplicateSaree);

// Image management
router.post('/:id/images', upload.array('images', 8), addSareeImages);
router.delete('/:id/images/:publicId', deleteSareeImage);
router.put('/:id/images/:publicId', upload.single('image'), replaceSareeImage);
router.put('/:id/images/:publicId/main', setMainImage);

module.exports = router;
