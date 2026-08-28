const asyncHandler = require('express-async-handler');
const Color = require('../models/Color');

// @desc    Get all colors
// @route   GET /api/colors
// @access  Public
const getColors = asyncHandler(async (req, res) => {
  const colors = await Color.find().sort({ name: 1 });
  res.json({ success: true, colors });
});

// @desc    Create color
// @route   POST /api/admin/colors
// @access  Private
const createColor = asyncHandler(async (req, res) => {
  const { name, code } = req.body;
  const color = await Color.create({ name, code });
  res.status(201).json({ success: true, color });
});

// @desc    Update color
// @route   PUT /api/admin/colors/:id
// @access  Private
const updateColor = asyncHandler(async (req, res) => {
  const color = await Color.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!color) {
    res.status(404);
    throw new Error('Color not found');
  }
  res.json({ success: true, color });
});

// @desc    Delete color
// @route   DELETE /api/admin/colors/:id
// @access  Private
const deleteColor = asyncHandler(async (req, res) => {
  const color = await Color.findByIdAndDelete(req.params.id);
  if (!color) {
    res.status(404);
    throw new Error('Color not found');
  }
  res.json({ success: true, message: 'Color deleted' });
});

module.exports = { getColors, createColor, updateColor, deleteColor };
