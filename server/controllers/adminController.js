const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const Bookmark = require('../models/Bookmark');
const StudentProfile = require('../models/StudentProfile');

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalOpportunities,
      totalUsers,
      totalBookmarks,
      categoryCounts,
      recentOpportunities,
    ] = await Promise.all([
      Opportunity.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'student' }),
      Bookmark.countDocuments(),
      Opportunity.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Opportunity.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title organization category createdAt'),
    ]);

    res.json({
      totalOpportunities,
      totalUsers,
      totalBookmarks,
      categoryCounts,
      recentOpportunities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all opportunities for admin (including inactive)
// @route   GET /api/admin/opportunities
// @access  Private/Admin
const getAllOpportunitiesAdmin = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Opportunity.countDocuments(filter);
    const opportunities = await Opportunity.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');

    res.json({
      opportunities,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminStats, getAllOpportunitiesAdmin };
