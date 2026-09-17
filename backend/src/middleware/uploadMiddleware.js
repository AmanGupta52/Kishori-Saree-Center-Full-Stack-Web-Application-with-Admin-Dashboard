const multer = require('multer');
const path = require('path');

// Keep files in memory so we can pipe the buffer straight to Cloudinary
// without ever writing to disk.
const storage = multer.memoryStorage();

// Accept any image type. Mobile browsers/OSes are inconsistent about the
// mimetype they report for newer formats - HEIC/HEIF photos straight off an
// iPhone camera in particular sometimes arrive with mimetype
// "application/octet-stream" or blank instead of "image/heic". So: accept
// anything whose mimetype starts with "image/", and fall back to checking
// the file extension for the cases where the browser didn't set a useful one.
const ACCEPTED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif',
  '.heic', '.heif', '.bmp', '.tiff', '.tif', '.svg',
];

const fileFilter = (req, file, cb) => {
  const isImageMime = Boolean(file.mimetype && file.mimetype.startsWith('image/'));
  const ext = path.extname(file.originalname || '').toLowerCase();
  const isAllowedExtension = ACCEPTED_EXTENSIONS.includes(ext);

  if (isImageMime || isAllowedExtension) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, WEBP, AVIF, GIF, HEIC/HEIF, BMP, TIFF, SVG).'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per image - phone camera photos (esp. HEIC) can run large
    files: 8, // main + up to 7 additional images
  },
});

module.exports = upload;