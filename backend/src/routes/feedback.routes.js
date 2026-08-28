const express = require('express');
const {
  getAllFeedbackAdmin,
  approveFeedback,
  rejectFeedback,
  deleteFeedback,
} = require('../controllers/feedback.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.get('/', getAllFeedbackAdmin);
router.put('/:id/approve', approveFeedback);
router.put('/:id/reject', rejectFeedback);
router.delete('/:id', deleteFeedback);

module.exports = router;
