const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Opportunity = require('../models/Opportunity');

/**
 * OpportunityHub Database Clean Utility
 *
 * This script ensures the database contains NO fake, invented, or unverified opportunities.
 * Real opportunities should be added through the Admin Dashboard.
 */

const run = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove any sample or unverified opportunities
    const result = await Opportunity.deleteMany({ isSampleData: true });
    console.log(`🗑  Removed ${result.deletedCount} sample/unverified opportunities from database.`);

    const count = await Opportunity.countDocuments();
    console.log(`📊 Current real opportunities in database: ${count}`);
    console.log('✨ Database is clean and ready for genuine opportunities to be added via the Admin Dashboard.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Clean script failed:', error.message);
    process.exit(1);
  }
};

run();
