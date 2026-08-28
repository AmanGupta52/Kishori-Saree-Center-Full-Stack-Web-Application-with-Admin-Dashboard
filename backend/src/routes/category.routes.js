const express = require('express');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const publicRouter = express.Router();
publicRouter.get('/', getCategories);

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.post('/', upload.single('image'), createCategory);
adminRouter.put('/:id', upload.single('image'), updateCategory);
adminRouter.delete('/:id', deleteCategory);

module.exports = { publicRouter, adminRouter };
