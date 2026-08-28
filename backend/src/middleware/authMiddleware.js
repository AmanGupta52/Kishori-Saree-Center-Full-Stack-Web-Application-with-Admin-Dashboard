const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const { jwtSecret, cookieName } = require('../config/env');

/**
 * Protects admin routes. Reads JWT from HTTP-only cookie (or Authorization header
 * as a fallback for tools like Postman), verifies it, and attaches req.admin.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.[cookieName];

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      res.status(401);
      throw new Error('Not authorized, admin not found');
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token invalid or expired');
  }
});

/**
 * Restricts a route to specific admin roles.
 * Usage: router.delete('/:id', protect, requireRole('superadmin'), handler)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    res.status(403);
    throw new Error('Not authorized for this action');
  }
  next();
};

module.exports = { protect, requireRole };
