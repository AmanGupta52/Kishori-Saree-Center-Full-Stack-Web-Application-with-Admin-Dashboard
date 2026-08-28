const express = require('express');

const authRoutes = require('./auth.routes');
const sareeRoutes = require('./saree.routes');
const adminSareeRoutes = require('./adminSaree.routes');
const categoryRoutes = require('./category.routes');
const colorRoutes = require('./color.routes');
const fabricRoutes = require('./fabric.routes');
const occasionRoutes = require('./occasion.routes');
const feedbackAdminRoutes = require('./feedback.routes');
const enquiryRoutes = require('./enquiry.routes');
const uploadRoutes = require('./upload.routes');
const dashboardRoutes = require('./dashboard.routes');
const settingsRoutes = require('./settings.routes');

const router = express.Router();

// ---------- Public routes (/api/...) ----------
router.use('/auth', authRoutes); // login/logout also lives here (public-ish)
router.use('/sarees', sareeRoutes);
router.use('/categories', categoryRoutes.publicRouter);
router.use('/colors', colorRoutes.publicRouter);
router.use('/fabrics', fabricRoutes.publicRouter);
router.use('/occasions', occasionRoutes.publicRouter);
router.use('/enquiries', enquiryRoutes.publicRouter);
router.use('/settings', settingsRoutes.publicRouter);

// ---------- Admin routes (/api/admin/...) ----------
const adminRouter = express.Router();
adminRouter.use('/sarees', adminSareeRoutes);
adminRouter.use('/categories', categoryRoutes.adminRouter);
adminRouter.use('/colors', colorRoutes.adminRouter);
adminRouter.use('/fabrics', fabricRoutes.adminRouter);
adminRouter.use('/occasions', occasionRoutes.adminRouter);
adminRouter.use('/feedback', feedbackAdminRoutes);
adminRouter.use('/enquiries', enquiryRoutes.adminRouter);
adminRouter.use('/upload', uploadRoutes);
adminRouter.use('/dashboard', dashboardRoutes);
adminRouter.use('/settings', settingsRoutes.adminRouter);

router.use('/admin', adminRouter);

module.exports = router;
