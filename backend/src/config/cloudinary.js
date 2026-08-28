const cloudinary = require('cloudinary').v2;
const { cloudinary: cloudinaryEnv } = require('./env');

cloudinary.config({
  cloud_name: cloudinaryEnv.cloudName,
  api_key: cloudinaryEnv.apiKey,
  api_secret: cloudinaryEnv.apiSecret,
  secure: true,
});

module.exports = cloudinary;
