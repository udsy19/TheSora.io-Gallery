const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
      .populate('collections');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { username, role, collections } = req.body;
    
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
      role: role || 'user',
      collections: collections || []
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

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    // Remove password field if it exists in the request
    if (req.body.password) {
      delete req.body.password;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Bulk create users
// @route   POST /api/users/bulk
// @access  Private/Admin
exports.bulkCreateUsers = async (req, res) => {
  try {
    const { users } = req.body;
    
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of users'
      });
    }
    
    const createdUsers = [];
    const errors = [];
    
    // Process each user
    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ username: userData.username });
        
        if (existingUser) {
          errors.push({
            username: userData.username,
            error: 'Username already exists'
          });
          continue;
        }
        
        // Generate random password
        const password = User.generateRandomPassword();
        
        // Create user
        const user = await User.create({
          username: userData.username,
          password,
          role: userData.role || 'user',
          collections: userData.collections || []
        });
        
        createdUsers.push({
          id: user._id,
          username: user.username,
          role: user.role,
          password // Include the generated password
        });
      } catch (error) {
        errors.push({
          username: userData.username,
          error: error.message
        });
      }
    }
    
    res.status(201).json({
      success: true,
      data: {
        createdUsers,
        errors,
        totalCreated: createdUsers.length,
        totalFailed: errors.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Bulk delete users
// @route   DELETE /api/users/bulk
// @access  Private/Admin
exports.bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of user IDs'
      });
    }
    
    const result = await User.deleteMany({ _id: { $in: userIds } });
    
    res.status(200).json({
      success: true,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};