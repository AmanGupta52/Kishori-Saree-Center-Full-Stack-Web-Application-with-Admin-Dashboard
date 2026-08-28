const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const { cloudinary: cloudinaryEnv } = require('../config/env');

/**
 * Uploads a single file buffer (from multer memoryStorage) to Cloudinary.
 * Automatically applies WebP/AVIF delivery + optimization via `fetch_format: auto, quality: auto`.
 *
 * @param {Buffer} fileBuffer - raw file buffer
 * @param {Object} options
 * @param {string} [options.folder] - Cloudinary folder, defaults to configured folder
 * @param {string} [options.publicId] - optional custom public_id
 * @returns {Promise<{url: string, publicId: string, width: number, height: number, format: string}>}
 */
const uploadBufferToCloudinary = (fileBuffer, options = {}) => {
  const folder = options.folder || cloudinaryEnv.folder;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options.publicId,
        resource_type: 'image',
        overwrite: true,
        // Deliver optimized, modern formats automatically (WebP/AVIF where supported)
        fetch_format: 'auto',
        quality: 'auto',
        // Generate a reasonable max size to avoid huge uploads bloating storage
        transformation: [{ width: 1600, height: 1600, crop: 'limit' }],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Uploads multiple files in parallel.
 * @param {Array<{buffer: Buffer}>} files - multer files array
 * @param {Object} options - see uploadBufferToCloudinary
 * @returns {Promise<Array>}
 */
const uploadMultipleToCloudinary = async (files, options = {}) => {
  const uploads = files.map((file) => uploadBufferToCloudinary(file.buffer, options));
  return Promise.all(uploads);
};

/**
 * Generates a Cloudinary thumbnail URL on the fly from a public_id.
 * Useful for product-card thumbnails without storing a second copy.
 */
const getThumbnailUrl = (publicId, { width = 400, height = 400 } = {}) =>
  cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'auto',
    fetch_format: 'auto',
    quality: 'auto',
    secure: true,
  });

/**
 * Deletes a single image from Cloudinary by public_id.
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
};

/**
 * Deletes multiple images from Cloudinary.
 * @param {string[]} publicIds
 */
const deleteMultipleFromCloudinary = async (publicIds = []) => {
  if (!publicIds.length) return null;
  return cloudinary.api.delete_resources(publicIds, { resource_type: 'image' });
};

module.exports = {
  uploadBufferToCloudinary,
  uploadMultipleToCloudinary,
  getThumbnailUrl,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
};
