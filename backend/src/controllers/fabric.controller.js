const asyncHandler = require('express-async-handler');
const Fabric = require('../models/Fabric');

// @desc    Get all fabrics
// @route   GET /api/fabrics
// @access  Public
const getFabrics = asyncHandler(async (req, res) => {
  const fabrics = await Fabric.find().sort({ name: 1 });
  res.json({ success: true, fabrics });
});

// @desc    Create fabric
// @route   POST /api/admin/fabrics
// @access  Private
const createFabric = asyncHandler(async (req, res) => {
  const fabric = await Fabric.create({ name: req.body.name });
  res.status(201).json({ success: true, fabric });
});

// @desc    Update fabric
// @route   PUT /api/admin/fabrics/:id
// @access  Private
const updateFabric = asyncHandler(async (req, res) => {
  const fabric = await Fabric.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!fabric) {
    res.status(404);
    throw new Error('Fabric not found');
  }
  res.json({ success: true, fabric });
});

// @desc    Delete fabric
// @route   DELETE /api/admin/fabrics/:id
// @access  Private
const deleteFabric = asyncHandler(async (req, res) => {
  const fabric = await Fabric.findByIdAndDelete(req.params.id);
  if (!fabric) {
    res.status(404);
    throw new Error('Fabric not found');
  }
  res.json({ success: true, message: 'Fabric deleted' });
});

module.exports = { getFabrics, createFabric, updateFabric, deleteFabric };
