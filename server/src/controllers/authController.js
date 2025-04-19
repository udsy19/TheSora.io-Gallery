const User = require('../models/User');
const Analytics = require('../models/Analytics');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Private/Admin
exports.register = async (req, res) => {
  try {
    const { username, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username already exists' 
      });
    }
    
    // Generate random password
    const password = User.generateRandomPassword();
    
    // Create user
    const user = await User.create({
      username,
      password,
      role: role || 'user'
    });
    
    // Send response with generated password (only shown once)
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        },
        password // This will be shown only once
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    console.log('Login attempt received:', req.body);
    const { username, password } = req.body;
    
    // Validate email & password
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide username and password' 
      });
    }
    
    // Check for user
    console.log('Looking for user with username:', username);
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    console.log('User found, checking password');
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    console.log('Password matches, updating last login time');
    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    
    try {
      console.log('Tracking login analytics');
      // Track login analytics
      await Analytics.create({
        user: user._id,
        actionType: 'login',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    } catch (error) {
      console.error('Error tracking analytics:', error);
      // Continue even if analytics tracking fails
    }
    
    console.log('Creating and sending token response');
    // Create and send token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  try {
    // Create token
    const token = user.getSignedJwtToken();
    console.log('Generated token for user:', user.username);
    
    // Create a clean user object to return without sensitive data
    const userObject = {
      id: user._id.toString(), // Convert ObjectId to string
      username: user.username,
      role: user.role
    };
    
    res.status(statusCode).json({
      success: true,
      token,
      user: userObject
    });
  } catch (error) {
    console.error('Error in sendTokenResponse:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate authentication token'
    });
  }
};