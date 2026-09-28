const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    organization: {
      type: String,
      required: [true, 'Organization is required'],
      trim: true,
      maxlength: [200, 'Organization name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Internship',
        'Hackathon',
        'Competition',
        'Scholarship',
        'Course',
        'Certification',
        'Workshop',
      ],
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    mode: {
      type: String,
      enum: ['Online', 'Offline', 'Hybrid'],
      required: [true, 'Mode is required'],
    },
    deadline: {
      type: Date,
    },
    applicationUrl: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSampleData: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
opportunitySchema.index({
  title: 'text',
  description: 'text',
  organization: 'text',
  skills: 'text',
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
