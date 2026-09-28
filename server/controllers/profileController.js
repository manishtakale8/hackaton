const StudentProfile = require('../models/StudentProfile');

// @desc    Get student profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await StudentProfile.create({
        user: req.user._id,
        fullName: req.user.name,
        email: req.user.email,
      });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const {
      fullName,
      college,
      degree,
      branch,
      currentYear,
      graduationYear,
      location,
      skills,
      interests,
      preferredCategories,
      bio,
    } = req.body;

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (college !== undefined) updateData.college = college;
    if (degree !== undefined) updateData.degree = degree;
    if (branch !== undefined) updateData.branch = branch;
    if (currentYear !== undefined) updateData.currentYear = currentYear;
    if (graduationYear !== undefined) updateData.graduationYear = graduationYear;
    if (location !== undefined) updateData.location = location;
    if (skills !== undefined) updateData.skills = Array.isArray(skills) ? skills : [];
    if (interests !== undefined) updateData.interests = Array.isArray(interests) ? interests : [];
    if (preferredCategories !== undefined)
      updateData.preferredCategories = Array.isArray(preferredCategories) ? preferredCategories : [];
    if (bio !== undefined) updateData.bio = bio;

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
