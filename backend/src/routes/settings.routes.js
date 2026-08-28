const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const { protect } = require('../middleware/authMiddleware');

const publicRouter = express.Router();
publicRouter.get('/', getSettings);

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.put('/', updateSettings);

module.exports = { publicRouter, adminRouter };
