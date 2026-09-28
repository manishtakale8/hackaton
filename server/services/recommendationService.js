const Opportunity = require('../models/Opportunity');
const StudentProfile = require('../models/StudentProfile');
const Bookmark = require('../models/Bookmark');
const calculateMatch = require('../utils/calculateMatch');

// @desc    Get personalized recommendations
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.json({ recommendations: [], hasProfile: false });
    }

    const hasProfile =
      profile.skills.length > 0 ||
      profile.interests.length > 0 ||
      profile.preferredCategories.length > 0;

    const opportunities = await Opportunity.find({ isActive: true });

    const bookmarks = await Bookmark.find({ user: req.user._id }).select('opportunity');
    const bookmarkedIds = new Set(bookmarks.map((b) => b.opportunity.toString()));

    const scored = opportunities
      .map((opp) => {
        const match = calculateMatch(profile, opp);
        const obj = opp.toObject();
        obj.matchScore = match.score;
        obj.matchReasons = match.reasons;
        obj.isBookmarked = bookmarkedIds.has(opp._id.toString());
        return obj;
      })
      .filter((opp) => opp.matchScore >= 30) // Only show relevant ones
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 12);

    res.json({ recommendations: scored, hasProfile });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
