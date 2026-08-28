const express = require('express');
const {
  loginAdmin,
  logoutAdmin,
  getMe,
  updateProfile,
  changePassword,
  bootstrapAdmin,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/bootstrap', bootstrapAdmin); // one-time use: creates the first superadmin
router.post('/login', loginAdmin);
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
