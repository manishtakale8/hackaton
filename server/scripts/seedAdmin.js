const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@opportunityhub.dev' });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists. Skipping.');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@opportunityhub.dev',
      password: 'Admin@123456',
      role: 'admin',
    });

    console.log(`✅ Admin created:`);
    console.log(`   Email: admin@opportunityhub.dev`);
    console.log(`   Password: Admin@123456`);
    console.log(`   ⚠️  Change this password in production!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Admin seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
