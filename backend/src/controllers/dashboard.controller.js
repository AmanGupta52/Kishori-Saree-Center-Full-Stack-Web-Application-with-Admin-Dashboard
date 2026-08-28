const asyncHandler = require('express-async-handler');
const Saree = require('../models/Saree');
const Category = require('../models/Category');
const Enquiry = require('../models/Enquiry');
const Feedback = require('../models/Feedback');

// @desc    Get admin dashboard summary stats
// @route   GET /api/admin/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalSarees,
    totalCategories,
    totalEnquiries,
    inStockCount,
    pendingFeedback,
    totalViewsAgg,
    outOfStockCount,
  ] = await Promise.all([
    Saree.countDocuments(),
    Category.countDocuments(),
    Enquiry.countDocuments(),
    Saree.countDocuments({ status: 'active', stock: { $gt: 0 } }),
    Feedback.countDocuments({ status: 'pending' }),
    Saree.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
    Saree.countDocuments({ status: 'out-of-stock' }),
  ]);

  res.json({
    success: true,
    stats: {
      totalSarees,
      totalCategories,
      totalEnquiries,
      inStockCount,
      outOfStockCount,
      pendingFeedback,
      totalViews: totalViewsAgg[0]?.total || 0,
    },
  });
});

module.exports = { getDashboardStats };
