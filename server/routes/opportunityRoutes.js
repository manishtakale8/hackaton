const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Optional auth middleware - attaches user if token present
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (_) {
      // Invalid token - just continue without user
    }
  }
  next();
};

router.get('/', optionalAuth, getOpportunities);
router.get('/:id', optionalAuth, getOpportunityById);
router.post('/', protect, adminOnly, createOpportunity);
router.put('/:id', protect, adminOnly, updateOpportunity);
router.delete('/:id', protect, adminOnly, deleteOpportunity);

module.exports = router;
