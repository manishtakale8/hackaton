const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
    },
    college: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    degree: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    branch: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    currentYear: {
      type: Number,
      min: 1,
      max: 7,
    },
    graduationYear: {
      type: Number,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    preferredCategories: {
      type: [String],
      enum: [
        'Internship',
        'Hackathon',
        'Competition',
        'Scholarship',
        'Course',
        'Certification',
        'Workshop',
      ],
      default: [],
    },
    bio: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for profile completion percentage
studentProfileSchema.virtual('completionPercentage').get(function () {
  const fields = [
    'fullName',
    'college',
    'degree',
    'branch',
    'currentYear',
    'graduationYear',
    'location',
  ];
  const arrayFields = ['skills', 'interests', 'preferredCategories'];

  let filled = 0;
  const total = fields.length + arrayFields.length;

  fields.forEach((f) => {
    if (this[f]) filled++;
  });
  arrayFields.forEach((f) => {
    if (this[f] && this[f].length > 0) filled++;
  });

  return Math.round((filled / total) * 100);
});

studentProfileSchema.set('toJSON', { virtuals: true });
studentProfileSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
