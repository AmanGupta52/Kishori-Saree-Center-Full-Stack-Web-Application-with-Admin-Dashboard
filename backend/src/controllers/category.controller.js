const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const { uploadMultipleToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const filter = req.query.activeOnly === 'true' ? { isActive: true } : {};
  const categories = await Category.find(filter).sort({ name: 1 });
  res.json({ success: true, categories });
});

// @desc    Create category (optional icon image)
// @route   POST /api/admin/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
  const { name, isActive } = req.body;

  let image;
  if (req.file) {
    const [uploaded] = await uploadMultipleToCloudinary([req.file], { folder: 'kishori-sarees/categories' });
    image = { url: uploaded.url, publicId: uploaded.publicId };
  }

  const category = await Category.create({ name, isActive, image });
  res.status(201).json({ success: true, category });
});

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (req.body.name) category.name = req.body.name;
  if (req.body.isActive !== undefined) category.isActive = req.body.isActive === 'true';

  if (req.file) {
    if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);
    const [uploaded] = await uploadMultipleToCloudinary([req.file], { folder: 'kishori-sarees/categories' });
    category.image = { url: uploaded.url, publicId: uploaded.publicId };
  }

  await category.save();
  res.json({ success: true, category });
});

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (category.image?.publicId) await deleteFromCloudinary(category.image.publicId);
  await category.deleteOne();

  res.json({ success: true, message: 'Category deleted' });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
