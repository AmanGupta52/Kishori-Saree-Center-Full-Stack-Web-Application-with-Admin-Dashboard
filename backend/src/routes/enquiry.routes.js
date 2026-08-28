const express = require('express');
const {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require('../controllers/enquiry.controller');
const { protect } = require('../middleware/authMiddleware');

const publicRouter = express.Router();
publicRouter.post('/', createEnquiry);

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.get('/', getEnquiries);
adminRouter.put('/:id', updateEnquiryStatus);
adminRouter.delete('/:id', deleteEnquiry);

module.exports = { publicRouter, adminRouter };
