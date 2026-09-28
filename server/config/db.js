const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is missing from server/.env');
    throw new Error('MONGODB_URI not set');
  }

  // Detect unfilled placeholders
  if (uri.includes('<username>') || uri.includes('<password>') || uri.includes('<db_password>')) {
    console.error('');
    console.error('❌  MONGODB_URI contains a placeholder in server/.env');
    console.error('    Replace <db_password> with your real Atlas password.');
    console.error('    Your URI: mongodb+srv://takalemanoj75_db_user:<db_password>@...');
    console.error('    Get your password from: https://cloud.mongodb.com → Database Access');
    console.error('');
    throw new Error('MONGODB_URI contains placeholder — replace <db_password>');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
      console.error('   DNS resolution failed for MongoDB Atlas SRV record.');
      console.error('   Ensure server.js sets dns.setServers before any require.');
    } else if (error.message.includes('Authentication failed')) {
      console.error('   Wrong password. Check MONGODB_URI in server/.env.');
    } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('   Your IP is not whitelisted. Go to Atlas → Network Access → Add IP.');
    }
    throw error;
  }
};

module.exports = connectDB;
