const asyncHandler = require('express-async-handler');
const Saree = require('../models/Saree');
const {
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
} = require('../utils/cloudinaryUpload');
const { calculatePricing } = require('../utils/priceCalculator');

// ------------------------------------------------------------------
// PUBLIC ENDPOINTS
// ------------------------------------------------------------------

// @desc    Get sarees with search, filters, sorting, pagination (public - active only)
// @route   GET /api/sarees
// @access  Public
const getSarees = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    color,
    fabric,
    occasion,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    page = 1,
    limit = 12,
    featured,
    newArrival,
    bestSeller,
  } = req.query;

  const query = { status: 'active' };

  if (search) {
    query.$text = { $search: search };
  }
  if (category) query.category = category;
  if (color) query.colors = color;
  if (fabric) query.fabric = fabric;
  if (occasion) query.occasions = occasion;
  if (featured) query.featured = featured === 'true';
  if (newArrival) query.newArrival = newArrival === 'true';
  if (bestSeller) query.bestSeller = bestSeller === 'true';

  if (minPrice || maxPrice) {
    query.sellingPrice = {};
    if (minPrice) query.sellingPrice.$gte = Number(minPrice);
    if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
  }

  if (minDiscount) {
    // discountAmount as % of originalPrice >= minDiscount
    query.$expr = {
      $gte: [{ $multiply: [{ $divide: ['$discountAmount', '$originalPrice'] }, 100] }, Number(minDiscount)],
    };
  }

  const sortMap = {
    newest: { createdAt: -1 },
    'price-low-high': { sellingPrice: 1 },
    'price-high-low': { sellingPrice: -1 },
    discount: { discountAmount: -1 },
    popularity: { views: -1 },
    'name-a-z': { name: 1 },
    'name-z-a': { name: -1 },
  };
  const sortOption = sortMap[sort] || sortMap.newest;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 50);
  const skip = (pageNum - 1) * limitNum;

  const [sarees, total] = await Promise.all([
    Saree.find(query)
      .populate('category', 'name slug')
      .populate('fabric', 'name')
      .populate('colors', 'name code')
      .populate('occasions', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Saree.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: sarees.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    sarees,
  });
});

// @desc    Get single saree by slug (public) + increment view count
// @route   GET /api/sarees/:slug
// @access  Public
const getSareeBySlug = asyncHandler(async (req, res) => {
  const saree = await Saree.findOneAndUpdate(
    { slug: req.params.slug, status: { $ne: 'inactive' } },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate('category', 'name slug')
    .populate('fabric', 'name')
    .populate('colors', 'name code')
    .populate('occasions', 'name');

  if (!saree) {
    res.status(404);
    throw new Error('Saree not found');
  }

  res.json({ success: true, saree });
});

// @desc    Get related/recommended sarees (rule-based)
// @route   GET /api/sarees/:slug/related
// @access  Public
const getRelatedSarees = asyncHandler(async (req, res) => {
  const saree = await Saree.findOne({ slug: req.params.slug });

  if (!saree) {
    res.status(404);
    throw new Error('Saree not found');
  }

  const priceMin = saree.sellingPrice * 0.7;
  const priceMax = saree.sellingPrice * 1.3;

  const related = await Saree.find({
    _id: { $ne: saree._id },
    status: 'active',
    $or: [
      { category: saree.category },
      { fabric: saree.fabric },
      { colors: { $in: saree.colors } },
      { occasions: { $in: saree.occasions } },
      { sellingPrice: { $gte: priceMin, $lte: priceMax } },
    ],
  })
    .populate('category', 'name slug')
    .populate('colors', 'name code')
    .limit(8);

  res.json({ success: true, sarees: related });
});

// ------------------------------------------------------------------
// ADMIN ENDPOINTS
// ------------------------------------------------------------------

// @desc    Get all sarees for admin (includes inactive/out-of-stock, no view increment)
// @route   GET /api/admin/sarees
// @access  Private
const getAdminSarees = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) query.$text = { $search: search };
  if (status) query.status = status;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 100);
  const skip = (pageNum - 1) * limitNum;

  const [sarees, total] = await Promise.all([
    Saree.find(query)
      .populate('category', 'name')
      .populate('fabric', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Saree.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: sarees.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    sarees,
  });
});

// @desc    Create a new saree with Cloudinary image upload
// @route   POST /api/admin/sarees
// @access  Private
// @note    Expects multipart/form-data. Files under field name "images".
const createSaree = asyncHandler(async (req, res) => {
  const body = req.body;

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('At least one saree image is required');
  }

  const uploaded = await uploadMultipleToCloudinary(req.files, {
    folder: `kishori-sarees/${body.slugHint || 'general'}`,
  });

  const mainIndex = body.mainImageIndex ? Number(body.mainImageIndex) : 0;
  const images = uploaded.map((img, idx) => ({
    url: img.url,
    publicId: img.publicId,
    isMain: idx === mainIndex,
  }));

  const saree = await Saree.create({
    name: body.name,
    sku: body.sku,
    category: body.category,
    subCategory: body.subCategory,
    fabric: body.fabric,
    colors: body.colors ? JSON.parse(body.colors) : [],
    occasions: body.occasions ? JSON.parse(body.occasions) : [],
    pattern: body.pattern,
    work: body.work,
    description: body.description,
    shortDescription: body.shortDescription,
    images,
    originalPrice: body.originalPrice,
    discountType: body.discountType || 'none',
    discountValue: body.discountValue || 0,
    sareeLength: body.sareeLength,
    blouseLength: body.blouseLength,
    stock: body.stock || 0,
    featured: body.featured === 'true',
    newArrival: body.newArrival === 'true',
    bestSeller: body.bestSeller === 'true',
    status: body.status || 'active',
  });

  res.status(201).json({ success: true, saree });
});

// @desc    Update a saree's text/number fields (no image changes here)
// @route   PUT /api/admin/sarees/:id
// @access  Private
const updateSaree = asyncHandler(async (req, res) => {
  const saree = await Saree.findById(req.params.id);

  if (!saree) {
    res.status(404);
    throw new Error('Saree not found');
  }

  const editableFields = [
    'name',
    'sku',
    'category',
    'subCategory',
    'fabric',
    'pattern',
    'work',
    'description',
    'shortDescription',
    'originalPrice',
    'discountType',
    'discountValue',
    'sareeLength',
    'blouseLength',
    'stock',
    'featured',
    'newArrival',
    'bestSeller',
    'status',
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      saree[field] = req.body[field];
    }
  });

  if (req.body.colors) saree.colors = JSON.parse(req.body.colors);
  if (req.body.occasions) saree.occasions = JSON.parse(req.body.occasions);

  await saree.save(); // pre-save hook recalculates pricing

  res.json({ success: true, saree });
});

// @desc    Add additional images to an existing saree
// @route   POST /api/admin/sarees/:id/images
// @access  Private
const addSareeImages = asyncHandler(async (req, res) => {
  const saree = await Saree.findById(req.params.id);

  if (!saree) {
    res.status(404);
    throw new Error('Saree not found');
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No images provided');
  }

  const uploaded = await uploadMultipleToCloudinary(req.files, {
    folder: `kishori-sarees/${saree.slug}`,
  });

  const newImages = uploaded.map((img) => ({ url: img.url, publicId: img.publicId, isMain: false }));
  saree.images.push(...newImages);
  await saree.save();

  res.json({ success: true, images: saree.images });
});

// @desc    Delete a single image from a saree (removes from Cloudinary + MongoDB)
// @route   DELETE /api/admin/sarees/:id/images/:publicId
// @access  Private
const deleteSareeImage = asyncHandler(async (req, res) => {
  const saree = await Saree.findById(req.params.id);

  if (!saree) {
    res.status(404);
    throw new Error('Saree not found');
  }

  const publicId = decodeURIComponent(req.params.publicId);
  const imageExists = saree.images.some((img) => img.publicId === publicId);

  if (!imageExists) {
    res.status(404);
    throw new Error('Image not found on this saree');
  }

  if (saree.images.length === 1) {
    res.status(400);
    throw new Error('Cannot delete the only remaining image. Upload a replacement first.');
  }

  await deleteFromCloudinary(publicId);

  const wasMain = saree.images.find((img) => img.publicId === publicId)?.isMain;
  saree.images = saree.images.filter((img) => img.publicId !== publicId);

  // If we deleted the main image, promote the next one
  if (wasMain && saree.images.length > 0) {
    saree.images[0].isMain = true;
  }

  await saree.save();

  res.json({ success: true, images: saree.images });
});

// @desc    Set which image is the main/cover image
// @route   PUT /api/admin/sarees/:id/images/:publicId/main
// @access  Private
const setMainImage = asyncHandler(async (req, res) => {
  const saree = await Saree.findById(req.params.id);

  if (!saree) {
    res.status(404);
    throw new Error('Saree not found');
  }

  const publicId = decodeURIComponent(req.params.publicId);
  let found = false;

  saree.images.forEach((img) => {
    img.isMain = img.publicId === publicId;
    if (img.isMain) found = true;
  });

  if (!found) {
    res.status(404);
    throw new Error('Image not found on this saree');
  }

  await saree.save();
  res.json({ success: true, images: saree.images });
});

// @desc    Replace a specific image (delete old from Cloudinary, upload new)
// @route   PUT /api/admin/sarees/:id/images/:publicId
// @access  Private
// @note    Expects a single file under field name "image"
const replaceSareeImage = asyncHandler(async (req, res) => {
  const saree = await Saree.findById(req.params.id);

  if (!saree) {
    res.status(404);
    throw new Error('Saree not found');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No replacement image provided');
  }

  const oldPublicId = decodeURIComponent(req.params.publicId);
  const targetImage = saree.images.find((img) => img.publicId === oldPublicId);

  if (!targetImage) {
    res.status(404);
    throw new Error('Image not found on this saree');
  }

  const [uploaded] = await uploadMultipleToCloudinary([req.file], {
    folder: `kishori-sarees/${saree.slug}`,
  });

  await deleteFromCloudinary(oldPublicId);

  targetImage.url = uploaded.url;
  targetImage.publicId = uploaded.publicId;

  await saree.save();
  res.json({ success: true, images: saree.images });
});

// @desc    Delete a saree entirely (removes all Cloudinary images too)
// @route   DELETE /api/admin/sarees/:id
// @access  Private
const deleteSaree = asyncHandler(async (req, res) => {
  const saree = await Saree.findById(req.params.id);

  if (!saree) {
    res.status(404);
    throw new Error('Saree not found');
  }

  const publicIds = saree.images.map((img) => img.publicId);
  if (publicIds.length > 0) {
    await deleteMultipleFromCloudinary(publicIds);
  }

  await saree.deleteOne();

  res.json({ success: true, message: 'Saree and its images deleted' });
});

// @desc    Duplicate an existing saree (new slug/sku, images shared by reference)
// @route   POST /api/admin/sarees/:id/duplicate
// @access  Private
const duplicateSaree = asyncHandler(async (req, res) => {
  const original = await Saree.findById(req.params.id).lean();

  if (!original) {
    res.status(404);
    throw new Error('Saree not found');
  }

  // eslint-disable-next-line no-unused-vars
  const { _id, slug, sku, createdAt, updatedAt, views, ...rest } = original;

  const duplicate = await Saree.create({
    ...rest,
    name: `${original.name} (Copy)`,
    sku: undefined,
  });

  res.status(201).json({ success: true, saree: duplicate });
});

// @desc    Preview discount calculation without saving (used by the admin form live-preview)
// @route   POST /api/admin/sarees/preview-price
// @access  Private
const previewPrice = asyncHandler(async (req, res) => {
  const { originalPrice, discountType, discountValue } = req.body;
  const result = calculatePricing(originalPrice, discountType, discountValue);
  res.json({ success: true, ...result });
});

module.exports = {
  getSarees,
  getSareeBySlug,
  getRelatedSarees,
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
};
