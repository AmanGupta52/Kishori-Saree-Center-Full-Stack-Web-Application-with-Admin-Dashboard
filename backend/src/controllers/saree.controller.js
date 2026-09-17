const asyncHandler = require('express-async-handler');
const Saree = require('../models/Saree');
const {
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
} = require('../utils/cloudinaryUpload');
const { calculatePricing } = require('../utils/priceCalculator');

// --- Small helpers that prevent the two error classes we kept hitting ---

// An empty string is not a valid ObjectId and is not "no SKU" - it's a value
// that either crashes a Mongoose cast (ObjectId refs) or collides with every
// other document that also has "" (sparse-unique fields like sku). Treat
// blank form fields as "not provided" instead of passing them through.
const emptyToUndefined = (value) => (value === '' || value === undefined || value === null ? undefined : value);

// Colors/occasions arrive as a JSON-stringified array of ids. Guard against
// malformed JSON and strip any falsy entries so we never hand Mongoose an
// array containing "".
const parseIdArray = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

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

  if (!body.category) {
    res.status(400);
    throw new Error('Category is required');
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
    // sku is unique+sparse: omit it entirely when blank rather than storing
    // "" (see emptyToUndefined comment above) so multiple blank-SKU sarees
    // don't collide on a duplicate-key error.
    sku: emptyToUndefined(body.sku),
    // category/fabric are ObjectId refs: "" is not a valid ObjectId, so we
    // never pass it through - category stays required (checked above),
    // fabric is optional and simply omitted when blank.
    category: emptyToUndefined(body.category),
    subCategory: body.subCategory,
    fabric: emptyToUndefined(body.fabric),
    colors: parseIdArray(body.colors),
    occasions: parseIdArray(body.occasions),
    pattern: body.pattern,
    work: body.work,
    description: body.description,
    shortDescription: body.shortDescription,
    images,
    originalPrice: Number(body.originalPrice) || 0,
    discountType: body.discountType || 'none',
    discountValue: Number(body.discountValue) || 0,
    sareeLength: body.sareeLength,
    blouseLength: body.blouseLength,
    stock: Number(body.stock) || 0,
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

  const body = req.body;

  // Plain string fields - safe to assign as-is, including "" (which clears the field).
  const stringFields = [
    'name',
    'subCategory',
    'pattern',
    'work',
    'description',
    'shortDescription',
    'sareeLength',
    'blouseLength',
    'discountType',
    'status',
  ];
  stringFields.forEach((field) => {
    if (body[field] !== undefined) saree[field] = body[field];
  });

  // ObjectId-ref fields - "" is never valid, so treat it as "unset" instead
  // of letting Mongoose attempt (and fail) to cast it to an ObjectId. This
  // is the exact bug from the "Cast to ObjectId failed ... path 'fabric'" error.
  if (body.category !== undefined) {
    const next = emptyToUndefined(body.category);
    if (next === undefined) {
      res.status(400);
      throw new Error('Category is required and cannot be cleared.');
    }
    saree.category = next;
  }
  if (body.fabric !== undefined) saree.fabric = emptyToUndefined(body.fabric);

  // sku is unique+sparse - "" collides with every other blank-SKU saree, so
  // an empty value here means "remove the SKU", not "set SKU to empty string".
  if (body.sku !== undefined) saree.sku = emptyToUndefined(body.sku);

  // Numeric fields - coerce explicitly so a stray empty string can't
  // silently zero out a price, and so string values (FormData) and native
  // numbers (JSON body) both behave the same way.
  if (body.originalPrice !== undefined) saree.originalPrice = Number(body.originalPrice) || 0;
  if (body.discountValue !== undefined) saree.discountValue = Number(body.discountValue) || 0;
  if (body.stock !== undefined) saree.stock = Number(body.stock) || 0;

  // Boolean flags - accept either a real boolean (JSON callers) or the
  // string 'true'/'false' (FormData callers).
  ['featured', 'newArrival', 'bestSeller'].forEach((field) => {
    if (body[field] !== undefined) saree[field] = body[field] === true || body[field] === 'true';
  });

  if (body.colors !== undefined) saree.colors = parseIdArray(body.colors);
  if (body.occasions !== undefined) saree.occasions = parseIdArray(body.occasions);

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
    sku: undefined, // never duplicate a SKU - see the sparse-unique note above
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