const express = require('express');
const router = express.Router();
const { getAdminStats, getAllOpportunitiesAdmin } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/opportunities', getAllOpportunitiesAdmin);

module.exports = router;
