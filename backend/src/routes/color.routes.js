const express = require('express');
const { getColors, createColor, updateColor, deleteColor } = require('../controllers/color.controller');
const { protect } = require('../middleware/authMiddleware');

const publicRouter = express.Router();
publicRouter.get('/', getColors);

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.post('/', createColor);
adminRouter.put('/:id', updateColor);
adminRouter.delete('/:id', deleteColor);

module.exports = { publicRouter, adminRouter };
