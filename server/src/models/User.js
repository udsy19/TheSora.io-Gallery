const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  collections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection'
  }],
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { suppressReservedKeysWarning: true });

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  try {
    // Make sure we use a consistent payload format
    const payload = {
      id: this._id.toString(), // Convert ObjectId to string for consistency
      role: this.role,
      username: this.username,
      // Add iat (issued at) automatically by jwt.sign
    };
    
    // Log the payload for debugging
    console.log('Creating JWT with payload:', payload);
    
    return jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRE }
    );
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw error;
  }
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Generate random password
UserSchema.statics.generateRandomPassword = function(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

module.exports = mongoose.model('User', UserSchema);