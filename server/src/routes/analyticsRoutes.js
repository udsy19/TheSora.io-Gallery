const express = require('express');
const {
  getDashboardAnalytics,
  getLoginAnalytics,
  getDownloadAnalytics,
  getUserAnalytics
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Temporarily remove authentication
// router.use(protect);
// router.use(authorize('admin'));

router.get('/dashboard', getDashboardAnalytics);
router.get('/logins', getLoginAnalytics);
router.get('/downloads', getDownloadAnalytics);
router.get('/users/:userId', getUserAnalytics);

module.exports = router;