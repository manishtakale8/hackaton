// IMPORTANT: DNS override must be the very first line, before any other require.
// Fixes: querySrv ECONNREFUSED on Windows when connecting to MongoDB Atlas.
// Node.js uses the Windows system DNS resolver by default, which cannot resolve
// MongoDB Atlas SRV records reliably. nslookup works because it queries 8.8.8.8
// directly. This makes Node.js do the same.
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Start HTTP server FIRST so port 5000 is available immediately.
  // This means the frontend gets real API error responses instead of
  // "Network Error" (ERR_CONNECTION_REFUSED) if DB takes time to connect.
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 OpportunityHub Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Connecting to MongoDB Atlas...`);
  });

  // Connect to MongoDB Atlas after server is listening
  try {
    await connectDB();
    console.log('✅ MongoDB connected. Ready to accept requests.');
  } catch (err) {
    console.error('💥 MongoDB connection failed. Shutting down server.');
    server.close(() => process.exit(1));
    return;
  }

  // Graceful shutdown (required for Google Cloud Run)
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing HTTP server...');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  });
};

startServer();
