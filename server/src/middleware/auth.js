const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers['x-auth-token']) {
    // Alternative header
    token = req.headers['x-auth-token'];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Not authorized to access this route' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Log the decoded token for debugging
    console.log('Decoded token:', decoded);
    
    // Find user by id - handle both formats
    const userId = decoded.id || (decoded.user && decoded.user.id);
    
    if (!userId) {
      console.error('No user ID found in token:', decoded);
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token format' 
      });
    }
    
    req.user = await User.findById(userId);
    
    // If no user is found, throw error
    if (!req.user) {
      console.error('No user found with ID:', userId);
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized to access this route' 
      });
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      error: 'Token is not valid' 
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

// Track analytics middleware
exports.trackAnalytics = (actionType) => {
  return async (req, res, next) => {
    try {
      // Only track if user is authenticated
      if (req.user && req.user._id) {
        const Analytics = require('../models/Analytics');
        
        const analyticsData = {
          user: req.user._id,
          actionType,
          timestamp: new Date(),
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        };
        
        // Add image id if provided
        if (req.params.imageId) {
          analyticsData.image = req.params.imageId;
        }
        
        // Add collection id if provided
        if (req.params.collectionId) {
          analyticsData.collection = req.params.collectionId;
        }
        
        // Save analytics data
        await Analytics.create(analyticsData);
      }
      
      next();
    } catch (error) {
      // Don't fail the request if analytics tracking fails
      console.error('Analytics tracking failed:', error);
      next();
    }
  };
};