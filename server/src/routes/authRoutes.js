const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', login);
router.get('/me', protect, getMe);

// Test route for debugging auth
router.post('/debug-token', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'No token provided'
    });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const config = require('../config/config');
    
    // Attempt to decode without verification
    const decoded = jwt.decode(token);
    
    // Attempt to verify
    try {
      const verified = jwt.verify(token, config.JWT_SECRET);
      return res.json({
        success: true,
        message: 'Token is valid',
        decoded,
        verified
      });
    } catch (verifyError) {
      return res.json({
        success: false,
        message: 'Token verification failed',
        error: verifyError.message,
        decoded
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Admin only routes
router.post('/register', protect, authorize('admin'), register);

module.exports = router;