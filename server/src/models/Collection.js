const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a collection name'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }],
  accessibleBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Collection', CollectionSchema);