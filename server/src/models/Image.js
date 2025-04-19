const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, { suppressReservedKeysWarning: true });

// Update view count
ImageSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Update download count
ImageSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

module.exports = mongoose.model('Image', ImageSchema);