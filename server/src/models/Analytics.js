const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String,
    enum: ['login', 'download', 'view'],
    required: true
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    default: null
  },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);