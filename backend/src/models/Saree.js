const mongoose = require('mongoose');
const slugify = require('slugify');

// Each image lives in Cloudinary; MongoDB only stores the reference.
const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    isMain: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const sareeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Saree name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    subCategory: {
      type: String,
      trim: true,
    },
    fabric: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fabric',
    },
    colors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color',
      },
    ],
    occasions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Occasion',
      },
    ],
    pattern: {
      type: String,
      trim: true,
    },
    work: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    // Cloudinary images
    images: {
      type: [imageSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one image is required',
      },
    },

    // Pricing
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
      min: 0,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed', 'none'],
      default: 'none',
    },
    discountValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      min: 0,
    },

    // Saree specific measurements
    sareeLength: {
      type: String,
      trim: true,
    },
    blouseLength: {
      type: String,
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Homepage flags
    featured: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'out-of-stock', 'coming-soon'],
      default: 'active',
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// --- Indexes for search/filter performance ---
sareeSchema.index({ name: 'text', shortDescription: 'text', description: 'text' });
sareeSchema.index({ status: 1, featured: 1, newArrival: 1, bestSeller: 1 });
sareeSchema.index({ sellingPrice: 1 });

// --- Pre-save hooks: slug + auto price calculation ---
sareeSchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${Date.now()
      .toString()
      .slice(-5)}`;
  }
  next();
});

sareeSchema.pre('save', function calculatePricing(next) {
  const original = this.originalPrice || 0;

  if (this.discountType === 'percentage') {
    this.discountAmount = Math.round((original * (this.discountValue || 0)) / 100);
  } else if (this.discountType === 'fixed') {
    this.discountAmount = this.discountValue || 0;
  } else {
    this.discountAmount = 0;
  }

  this.sellingPrice = Math.max(original - this.discountAmount, 0);

  // Keep stock/status in sync
  if (this.stock <= 0 && this.status === 'active') {
    this.status = 'out-of-stock';
  }

  next();
});

// Ensure exactly one main image
sareeSchema.pre('save', function ensureMainImage(next) {
  if (this.images && this.images.length > 0) {
    const hasMain = this.images.some((img) => img.isMain);
    if (!hasMain) {
      this.images[0].isMain = true;
    }
  }
  next();
});

module.exports = mongoose.model('Saree', sareeSchema);
