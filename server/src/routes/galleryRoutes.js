const express = require('express');
const {
  uploadImage,
  uploadMultipleImages,
  getImagesInCollection,
  getImage,
  deleteImage,
  getImageDownloadUrl
} = require('../controllers/imageController');
const {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  updateCollectionAccess
} = require('../controllers/collectionController');
const { protect, authorize, trackAnalytics } = require('../middleware/auth');

const router = express.Router();

// Temporarily remove authentication
// router.use(protect);

// Collection routes
router.route('/collections')
  .get(getCollections)
  .post(createCollection);

router.route('/collections/:id')
  .get(getCollection)
  .put(updateCollection)
  .delete(deleteCollection);

router.put('/collections/:id/access', updateCollectionAccess);

// Image routes
router.get('/collections/:collectionId/images', getImagesInCollection);

// Import upload middleware from storage utility
const { upload } = require('../utils/storage');

// Upload routes with multer middleware
router.post('/upload/:collectionId', upload.single('image'), uploadImage);
router.post('/upload-batch/:collectionId', upload.array('images', 20), uploadMultipleImages);

router.route('/images/:id')
  .get(getImage)
  .delete(deleteImage);

router.get('/images/:id/download', getImageDownloadUrl);

module.exports = router;