const asyncHandler = require('express-async-handler');
const Occasion = require('../models/Occasion');

// @desc    Get all occasions
// @route   GET /api/occasions
// @access  Public
const getOccasions = asyncHandler(async (req, res) => {
  const occasions = await Occasion.find().sort({ name: 1 });
  res.json({ success: true, occasions });
});

// @desc    Create occasion
// @route   POST /api/admin/occasions
// @access  Private
const createOccasion = asyncHandler(async (req, res) => {
  const occasion = await Occasion.create({ name: req.body.name });
  res.status(201).json({ success: true, occasion });
});

// @desc    Update occasion
// @route   PUT /api/admin/occasions/:id
// @access  Private
const updateOccasion = asyncHandler(async (req, res) => {
  const occasion = await Occasion.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!occasion) {
    res.status(404);
    throw new Error('Occasion not found');
  }
  res.json({ success: true, occasion });
});

// @desc    Delete occasion
// @route   DELETE /api/admin/occasions/:id
// @access  Private
const deleteOccasion = asyncHandler(async (req, res) => {
  const occasion = await Occasion.findByIdAndDelete(req.params.id);
  if (!occasion) {
    res.status(404);
    throw new Error('Occasion not found');
  }
  res.json({ success: true, message: 'Occasion deleted' });
});

module.exports = { getOccasions, createOccasion, updateOccasion, deleteOccasion };
