const asyncHandler = require('express-async-handler');
const { uploadMultipleToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Generic image upload (used for homepage banners, about-us images, etc.)
// @route   POST /api/admin/upload
// @access  Private
// @note    Accepts one or more files under field name "images"
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files provided');
  }

  const folder = req.body.folder ? `kishori-sarees/${req.body.folder}` : undefined;
  const uploaded = await uploadMultipleToCloudinary(req.files, { folder });

  res.status(201).json({ success: true, images: uploaded });
});

// @desc    Delete an arbitrary image by its Cloudinary public_id
// @route   DELETE /api/admin/upload/:publicId
// @access  Private
const deleteImage = asyncHandler(async (req, res) => {
  const publicId = decodeURIComponent(req.params.publicId);
  const result = await deleteFromCloudinary(publicId);
  res.json({ success: true, result });
});

module.exports = { uploadImages, deleteImage };
