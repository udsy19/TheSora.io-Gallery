const Image = require('../models/Image');
const Collection = require('../models/Collection');
const Analytics = require('../models/Analytics');
const path = require('path');
const fs = require('fs');
const { upload, uploadToB2, getSignedDownloadUrl, deleteFromB2 } = require('../utils/storage');

// @desc    Upload image to B2
// @route   POST /api/gallery/upload/:collectionId
// @access  Private/Admin
exports.uploadImage = async (req, res) => {
  try {
    // Check if collection exists
    const collection = await Collection.findById(req.params.collectionId);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found'
      });
    }
    
    // Make sure user has permission to upload to this collection
    if (
      req.user.role !== 'admin' &&
      collection.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to upload to this collection'
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file'
      });
    }
    
    // Upload file to B2
    const result = await uploadToB2(req.file, req.params.collectionId);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'File upload failed'
      });
    }
    
    // Create image record in database
    const image = await Image.create({
      filename: path.basename(result.key),
      originalName: req.file.originalname,
      path: result.url,
      key: result.key,
      size: req.file.size,
      mimetype: req.file.mimetype,
      collection: collection._id,
      uploadedBy: req.user._id
    });
    
    // Add image to collection
    collection.images.push(image._id);
    await collection.save();
    
    res.status(201).json({
      success: true,
      data: image
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Upload multiple images to B2
// @route   POST /api/gallery/upload-batch/:collectionId
// @access  Private/Admin
exports.uploadMultipleImages = async (req, res) => {
  try {
    // Check if collection exists
    const collection = await Collection.findById(req.params.collectionId);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found'
      });
    }
    
    // Make sure user has permission to upload to this collection
    if (
      req.user.role !== 'admin' &&
      collection.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to upload to this collection'
      });
    }
    
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please upload at least one file'
      });
    }
    
    const uploadedImages = [];
    
    // Process each file
    for (const file of req.files) {
      try {
        // Upload file to B2
        const result = await uploadToB2(file, req.params.collectionId);
        
        if (!result.success) {
          console.error(`Error uploading ${file.originalname}:`, result.error);
          continue; // Skip this file and try the next one
        }
        
        // Create image record in database
        const image = await Image.create({
          filename: path.basename(result.key),
          originalName: file.originalname,
          path: result.url,
          key: result.key,
          size: file.size,
          mimetype: file.mimetype,
          collection: collection._id,
          uploadedBy: req.user._id
        });
        
        // Add image to collection
        collection.images.push(image._id);
        
        uploadedImages.push(image);
      } catch (error) {
        console.error(`Error uploading file ${file.originalname}:`, error);
      }
    }
    
    // Save collection with new images
    await collection.save();
    
    res.status(201).json({
      success: true,
      count: uploadedImages.length,
      data: uploadedImages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all images in a collection
// @route   GET /api/gallery/collections/:collectionId/images
// @access  Private
exports.getImagesInCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.collectionId)
      .populate({
        path: 'images',
        options: { sort: { uploadedAt: -1 } }
      });
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found'
      });
    }
    
    // Temporarily disable authentication check
    /*
    if (
      req.user.role !== 'admin' &&
      !collection.accessibleBy.includes(req.user._id) &&
      collection.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this collection'
      });
    }
    */
    
    res.status(200).json({
      success: true,
      count: collection.images.length,
      data: collection.images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single image
// @route   GET /api/gallery/images/:id
// @access  Private
exports.getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
      .populate('collection')
      .populate('uploadedBy', 'username');
    
    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }
    
    // Get the collection to check for access
    const collection = await Collection.findById(image.collection);
    
    // Temporarily disable authentication check
    /*
    if (
      req.user.role !== 'admin' &&
      !collection.accessibleBy.includes(req.user._id) &&
      collection.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this image'
      });
    }
    
    // Track image view
    await Analytics.create({
      user: req.user._id,
      actionType: 'view',
      image: image._id,
      collection: collection._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    */
    
    // Just increment the view count without tracking
    try {
      await image.incrementViews();
    } catch (error) {
      console.error('Error incrementing view count:', error);
      // Continue even if there's an error
    }
    
    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete image
// @route   DELETE /api/gallery/images/:id
// @access  Private/Admin
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }
    
    // Get the collection to check for permission
    const collection = await Collection.findById(image.collection);
    
    // Make sure user has permission to delete this image
    if (
      req.user.role !== 'admin' &&
      collection.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this image'
      });
    }
    
    // Delete image from B2
    const deleteResult = await deleteFromB2(image.key);
    
    if (!deleteResult.success) {
      console.error('Error deleting image from B2:', deleteResult.error);
      // Continue anyway to clean up the database references
    }
    
    // Remove image from collection
    collection.images.pull(image._id);
    await collection.save();
    
    // Delete image from database
    await image.deleteOne();
    
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

// @desc    Get image download URL
// @route   GET /api/gallery/images/:id/download
// @access  Private
exports.getImageDownloadUrl = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }
    
    // Get the collection to check for access
    const collection = await Collection.findById(image.collection);
    
    // Temporarily disable authentication check
    /*
    if (
      req.user.role !== 'admin' &&
      !collection.accessibleBy.includes(req.user._id) &&
      collection.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to download this image'
      });
    }
    */
    
    // Generate signed URL for downloading
    const result = await getSignedDownloadUrl(image.key);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to generate download URL'
      });
    }
    
    const url = result.url;
    
    // Temporarily disable analytics tracking
    /*
    // Track image download
    await Analytics.create({
      user: req.user._id,
      actionType: 'download',
      image: image._id,
      collection: collection._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    */
    
    // Just increment the download count without tracking
    try {
      await image.incrementDownloads();
    } catch (error) {
      console.error('Error incrementing download count:', error);
      // Continue even if there's an error
    }
    
    res.status(200).json({
      success: true,
      data: {
        url,
        expiresIn: '5 minutes'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};