const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const generateTokenAndSetCookie = require('../utils/generateToken');
const { cookieName } = require('../config/env');

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

  if (!admin || !(await admin.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  generateTokenAndSetCookie(res, admin._id);

  res.json({
    success: true,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

// @desc    Admin logout
// @route   POST /api/auth/logout
// @access  Private
const logoutAdmin = asyncHandler(async (req, res) => {
  res.clearCookie(cookieName);
  res.json({ success: true, message: 'Logged out' });
});

// @desc    Get current logged-in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// @desc    Update own profile (name/email)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (req.body.name) admin.name = req.body.name;
  if (req.body.email) admin.email = req.body.email.toLowerCase();

  await admin.save();

  res.json({
    success: true,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin._id).select('+password');

  if (!(await admin.comparePassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  admin.password = newPassword;
  await admin.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

// @desc    Create the first admin (only works if no admin exists yet - a bootstrap route)
// @route   POST /api/auth/bootstrap
// @access  Public (self-locking)
const bootstrapAdmin = asyncHandler(async (req, res) => {
  const existingCount = await Admin.countDocuments();
  if (existingCount > 0) {
    res.status(403);
    throw new Error('Admin already exists. Bootstrap route is disabled.');
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const admin = await Admin.create({ name, email, password, role: 'superadmin' });

  generateTokenAndSetCookie(res, admin._id);

  res.status(201).json({
    success: true,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
});

module.exports = { loginAdmin, logoutAdmin, getMe, updateProfile, changePassword, bootstrapAdmin };
