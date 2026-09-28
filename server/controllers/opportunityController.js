const Opportunity = require('../models/Opportunity');
const StudentProfile = require('../models/StudentProfile');
const Bookmark = require('../models/Bookmark');
const calculateMatch = require('../utils/calculateMatch');

// @desc    Get all opportunities with search/filter/sort
// @route   GET /api/opportunities
// @access  Public
const getOpportunities = async (req, res, next) => {
  try {
    const {
      search,
      category,
      mode,
      location,
      skills,
      interests,
      sortBy,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (mode) filter.mode = mode;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (skills) {
      const skillsArr = skills.split(',').map((s) => s.trim().toLowerCase());
      filter.skills = { $in: skillsArr };
    }
    if (interests) {
      const interestsArr = interests.split(',').map((i) => i.trim().toLowerCase());
      filter.interests = { $in: interestsArr };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'deadline') sortOption = { deadline: 1 };
    if (sortBy === 'newest') sortOption = { createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Opportunity.countDocuments(filter);
    const opportunities = await Opportunity.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // If user is logged in, add match scores and bookmark status
    let bookmarkedIds = new Set();
    let profile = null;

    if (req.user) {
      profile = await StudentProfile.findOne({ user: req.user._id });
      const bookmarks = await Bookmark.find({ user: req.user._id }).select('opportunity');
      bookmarkedIds = new Set(bookmarks.map((b) => b.opportunity.toString()));
    }

    const enriched = opportunities.map((opp) => {
      const obj = opp.toObject();
      if (profile) {
        const match = calculateMatch(profile, opp);
        obj.matchScore = match.score;
        obj.matchReasons = match.reasons;
      }
      obj.isBookmarked = bookmarkedIds.has(opp._id.toString());
      return obj;
    });

    // If sorting by match score
    if (sortBy === 'match' && profile) {
      enriched.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    res.json({
      opportunities: enriched,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get opportunity by ID
// @route   GET /api/opportunities/:id
// @access  Public
const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    const obj = opportunity.toObject();

    if (req.user) {
      const profile = await StudentProfile.findOne({ user: req.user._id });
      if (profile) {
        const match = calculateMatch(profile, opportunity);
        obj.matchScore = match.score;
        obj.matchReasons = match.reasons;
      }
      const bookmark = await Bookmark.findOne({
        user: req.user._id,
        opportunity: opportunity._id,
      });
      obj.isBookmarked = !!bookmark;
    }

    res.json(obj);
  } catch (error) {
    next(error);
  }
};

// @desc    Create opportunity (admin)
// @route   POST /api/opportunities
// @access  Private/Admin
const createOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(opportunity);
  } catch (error) {
    next(error);
  }
};

// @desc    Update opportunity (admin)
// @route   PUT /api/opportunities/:id
// @access  Private/Admin
const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete opportunity (admin)
// @route   DELETE /api/opportunities/:id
// @access  Private/Admin
const deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByIdAndDelete(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Remove all bookmarks for this opportunity
    await Bookmark.deleteMany({ opportunity: req.params.id });

    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
