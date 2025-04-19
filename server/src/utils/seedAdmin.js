/**
 * Script to seed an initial admin user in the database
 * Run with: node server/src/utils/seedAdmin.js
 */

const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/User');

async function seedAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (adminExists) {
      console.log('Admin user already exists.');
      return;
    }

    // Create admin user
    const password = 'admin123'; // Change this to a secure password
    const admin = await User.create({
      username: 'admin',
      password,
      role: 'admin'
    });

    console.log('Admin user created successfully:');
    console.log(`Username: admin`);
    console.log(`Password: ${password}`);
    console.log('Please change this password after first login!');

  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedAdmin();