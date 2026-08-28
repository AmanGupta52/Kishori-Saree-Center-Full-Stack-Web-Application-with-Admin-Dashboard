const express = require('express');
const { getFabrics, createFabric, updateFabric, deleteFabric } = require('../controllers/fabric.controller');
const { protect } = require('../middleware/authMiddleware');

const publicRouter = express.Router();
publicRouter.get('/', getFabrics);

const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.post('/', createFabric);
adminRouter.put('/:id', updateFabric);
adminRouter.delete('/:id', deleteFabric);

module.exports = { publicRouter, adminRouter };
