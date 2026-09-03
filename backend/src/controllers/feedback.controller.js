const asyncHandler = require('express-async-handler');
const Feedback = require('../models/Feedback');
const { uploadMultipleToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const { sendFeedbackEmail } = require('../utils/mailer');

// @desc    Get approved feedback for a saree (public)
// @route   GET /api/sarees/:sareeId/feedback
// @access  Public
const getApprovedFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({
    saree: req.params.sareeId,
    status: 'approved',
  }).sort({ createdAt: -1 });

  res.json({ success: true, feedback });
});

// @desc    Submit feedback for a saree (public, goes to "pending")
// @route   POST /api/sarees/:sareeId/feedback
// @access  Public
const submitFeedback = asyncHandler(async (req, res) => {
  const { name, rating, comment } = req.body;

  if (!name || !rating || !comment) {
    res.status(400);
    throw new Error('Name, rating, and comment are required');
  }

  let photo;
  if (req.file) {
    const [uploaded] = await uploadMultipleToCloudinary([req.file], { folder: 'kishori-sarees/feedback' });
    photo = { url: uploaded.url, publicId: uploaded.publicId };
  }

  const feedback = await Feedback.create({
    saree: req.params.sareeId,
    name,
    rating,
    comment,
    photo,
    status: 'pending',
  });

  try {
    await sendFeedbackEmail({
      name,
      rating,
      comment,
      sareeId: req.params.sareeId,
      photoUrl: photo?.url,
    });
  } catch (emailErr) {
    console.error('Failed to send feedback email:', emailErr.message);
    // Don't throw — feedback is already saved, email is a nice-to-have
  }

  res.status(201).json({
    success: true,
    message: 'Thank you! Your feedback will appear after admin approval.',
    feedback,
  });
});

// @desc    Get all feedback for admin (any status)
// @route   GET /api/admin/feedback
// @access  Private
const getAllFeedbackAdmin = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const feedback = await Feedback.find(filter).populate('saree', 'name slug').sort({ createdAt: -1 });
  res.json({ success: true, feedback });
});

// @desc    Approve feedback
// @route   PUT /api/admin/feedback/:id/approve
// @access  Private
const approveFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    { new: true }
  );
  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }
  res.json({ success: true, feedback });
});

// @desc    Reject feedback (hides from public)
// @route   PUT /api/admin/feedback/:id/reject
// @access  Private
const rejectFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected' },
    { new: true }
  );
  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }
  res.json({ success: true, feedback });
});

// @desc    Delete feedback permanently
// @route   DELETE /api/admin/feedback/:id
// @access  Private
const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }

  if (feedback.photo?.publicId) await deleteFromCloudinary(feedback.photo.publicId);
  await feedback.deleteOne();

  res.json({ success: true, message: 'Feedback deleted' });
});

module.exports = {
  getApprovedFeedback,
  submitFeedback,
  getAllFeedbackAdmin,
  approveFeedback,
  rejectFeedback,
  deleteFeedback,
};