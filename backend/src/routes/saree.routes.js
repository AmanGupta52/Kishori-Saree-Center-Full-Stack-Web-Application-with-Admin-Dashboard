const express = require('express');
const { getSarees, getSareeBySlug, getRelatedSarees } = require('../controllers/saree.controller');
const { getApprovedFeedback, submitFeedback } = require('../controllers/feedback.controller');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public browse/search/filter listing
router.get('/', getSarees);

// Single saree detail by slug
router.get('/:slug', getSareeBySlug);

// Related/recommended sarees
router.get('/:slug/related', getRelatedSarees);

// Feedback nested under a saree (public read of approved feedback + public submit)
router.get('/:sareeId/feedback', getApprovedFeedback);
router.post('/:sareeId/feedback', upload.single('photo'), submitFeedback);

module.exports = router;
