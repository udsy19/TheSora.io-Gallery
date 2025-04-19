const Collection = require('../models/Collection');
const User = require('../models/User');

// @desc    Get all collections
// @route   GET /api/collections
// @access  Private/Admin
exports.getCollections = async (req, res) => {
  try {
    let query;
    
    // If user is admin, get all collections
    if (req.user.role === 'admin') {
      query = Collection.find();
    } else {
      // If user is regular user, get only collections they have access to
      query = Collection.find({
        $or: [
          { accessibleBy: req.user._id },
          { createdBy: req.user._id }
        ]
      });
    }
    
    // Execute query
    const collections = await query.populate('createdBy', 'username');
    
    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single collection
// @route   GET /api/collections/:id
// @access  Private
exports.getCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('images')
      .populate('accessibleBy', 'username')
      .populate('createdBy', 'username');
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found'
      });
    }
    
    // Check if user has access to this collection
    if (
      req.user.role !== 'admin' &&
      !collection.accessibleBy.some(user => user._id.toString() === req.user._id.toString()) &&
      collection.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this collection'
      });
    }
    
    res.status(200).json({
      success: true,
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new collection
// @route   POST /api/collections
// @access  Private/Admin
exports.createCollection = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user._id;
    
    const collection = await Collection.create(req.body);
    
    res.status(201).json({
      success: true,
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private/Admin
exports.updateCollection = async (req, res) => {
  try {
    let collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found'
      });
    }
    
    // Make sure user is collection owner or admin
    if (
      req.user.role !== 'admin' &&
      collection.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this collection'
      });
    }
    
    collection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private/Admin
exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found'
      });
    }
    
    // Make sure user is collection owner or admin
    if (
      req.user.role !== 'admin' &&
      collection.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this collection'
      });
    }
    
    await collection.remove();
    
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

// @desc    Add users to collection
// @route   PUT /api/collections/:id/access
// @access  Private/Admin
exports.updateCollectionAccess = async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of user IDs'
      });
    }
    
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found'
      });
    }
    
    // Make sure user is collection owner or admin
    if (
      req.user.role !== 'admin' &&
      collection.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update access for this collection'
      });
    }
    
    // Update collection accessibleBy array
    collection.accessibleBy = userIds;
    await collection.save();
    
    // Update users' collections array
    await User.updateMany(
      { _id: { $in: userIds } },
      { $addToSet: { collections: collection._id } }
    );
    
    // Remove collection from users who no longer have access
    await User.updateMany(
      { 
        _id: { $nin: userIds },
        collections: collection._id
      },
      { $pull: { collections: collection._id } }
    );
    
    res.status(200).json({
      success: true,
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};