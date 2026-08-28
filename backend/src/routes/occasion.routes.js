const express = require('express');
const { getOccasions, createOccasion, updateOccasion, deleteOccasion } = require('../controllers/occasion.controller');
const { protect } = require('../middleware/authMiddleware');

const publicRouter = express.Router();
publicRouter.get('/', getOccasions);

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.post('/', createOccasion);
adminRouter.put('/:id', updateOccasion);
adminRouter.delete('/:id', deleteOccasion);

module.exports = { publicRouter, adminRouter };
