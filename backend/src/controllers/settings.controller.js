const asyncHandler = require('express-async-handler');
const Settings = require('../models/Settings');

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

// @desc    Get shop settings (public - used by the storefront header/footer)
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ success: true, settings });
});

// @desc    Update shop settings
// @route   PUT /api/admin/settings
// @access  Private
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  const editableFields = [
    'shopName',
    'tagline',
    'phone',
    'whatsapp',
    'email',
    'address',
    'city',
    'instagram',
    'facebook',
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) settings[field] = req.body[field];
  });

  await settings.save();
  res.json({ success: true, settings });
});

module.exports = { getSettings, updateSettings };
