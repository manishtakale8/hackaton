const Bookmark = require('../models/Bookmark');
const Opportunity = require('../models/Opportunity');
const StudentProfile = require('../models/StudentProfile');
const calculateMatch = require('../utils/calculateMatch');

// @desc    Get user bookmarks
// @route   GET /api/bookmarks
// @access  Private
const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate('opportunity')
      .sort({ createdAt: -1 });

    const profile = await StudentProfile.findOne({ user: req.user._id });

    const enriched = bookmarks
      .filter((b) => b.opportunity) // filter deleted opportunities
      .map((b) => {
        const obj = b.opportunity.toObject();
        if (profile) {
          const match = calculateMatch(profile, b.opportunity);
          obj.matchScore = match.score;
          obj.matchReasons = match.reasons;
        }
        obj.isBookmarked = true;
        obj.bookmarkId = b._id;
        return obj;
      });

    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

// @desc    Bookmark an opportunity
// @route   POST /api/bookmarks/:opportunityId
// @access  Private
const addBookmark = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    const existing = await Bookmark.findOne({
      user: req.user._id,
      opportunity: opportunityId,
    });

    if (existing) {
      return res.status(409).json({ message: 'Already bookmarked' });
    }

    const bookmark = await Bookmark.create({
      user: req.user._id,
      opportunity: opportunityId,
    });

    res.status(201).json({ message: 'Bookmarked successfully', bookmark });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/bookmarks/:opportunityId
// @access  Private
const removeBookmark = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user._id,
      opportunity: opportunityId,
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBookmarks, addBookmark, removeBookmark };
