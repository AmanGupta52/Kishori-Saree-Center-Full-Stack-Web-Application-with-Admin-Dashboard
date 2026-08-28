const asyncHandler = require('express-async-handler');
const Enquiry = require('../models/Enquiry');

// @desc    Submit an enquiry (public)
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = asyncHandler(async (req, res) => {
  const { sareeId, name, mobile, email, message } = req.body;

  if (!name || !mobile) {
    res.status(400);
    throw new Error('Name and mobile number are required');
  }

  const enquiry = await Enquiry.create({
    saree: sareeId || undefined,
    name,
    mobile,
    email,
    message,
  });

  res.status(201).json({ success: true, message: 'Enquiry received. We will contact you soon.', enquiry });
});

// @desc    Get all enquiries for admin
// @route   GET /api/admin/enquiries
// @access  Private
const getEnquiries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const enquiries = await Enquiry.find(filter).populate('saree', 'name slug').sort({ createdAt: -1 });
  res.json({ success: true, enquiries });
});

// @desc    Update enquiry status
// @route   PUT /api/admin/enquiries/:id
// @access  Private
const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!enquiry) {
    res.status(404);
    throw new Error('Enquiry not found');
  }
  res.json({ success: true, enquiry });
});

// @desc    Delete an enquiry
// @route   DELETE /api/admin/enquiries/:id
// @access  Private
const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) {
    res.status(404);
    throw new Error('Enquiry not found');
  }
  res.json({ success: true, message: 'Enquiry deleted' });
});

module.exports = { createEnquiry, getEnquiries, updateEnquiryStatus, deleteEnquiry };
