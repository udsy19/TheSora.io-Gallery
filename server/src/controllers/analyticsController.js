const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Image = require('../models/Image');
const Collection = require('../models/Collection');
const mongoose = require('mongoose');

// @desc    Get analytics dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // Get total counts
    const [
      totalUsers,
      totalImages,
      totalCollections,
      totalLogins,
      totalDownloads,
      totalViews
    ] = await Promise.all([
      User.countDocuments(),
      Image.countDocuments(),
      Collection.countDocuments(),
      Analytics.countDocuments({ actionType: 'login' }),
      Analytics.countDocuments({ actionType: 'download' }),
      Analytics.countDocuments({ actionType: 'view' })
    ]);
    
    // Get recent activities
    const recentActivities = await Analytics.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('user', 'username')
      .populate('image', 'originalName')
      .populate('collection', 'name');
    
    // Get activity by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activityByDay = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            actionType: '$actionType'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    // Get top users by download count
    const topUsersByDownloads = await Analytics.aggregate([
      {
        $match: { actionType: 'download' }
      },
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          username: '$userDetails.username',
          count: 1
        }
      }
    ]);
    
    // Get top collections by view count
    const topCollectionsByViews = await Analytics.aggregate([
      {
        $match: { 
          actionType: 'view',
          collection: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$collection',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'collections',
          localField: '_id',
          foreignField: '_id',
          as: 'collectionDetails'
        }
      },
      {
        $unwind: '$collectionDetails'
      },
      {
        $project: {
          _id: 0,
          collectionId: '$_id',
          name: '$collectionDetails.name',
          count: 1
        }
      }
    ]);
    
    // Format activity by day for chart
    const activityChart = {};
    
    // Initialize with all dates and 0 counts
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      if (!activityChart[dateString]) {
        activityChart[dateString] = {
          date: dateString,
          login: 0,
          download: 0,
          view: 0
        };
      }
    }
    
    // Fill in actual counts
    activityByDay.forEach(activity => {
      const { date, actionType } = activity._id;
      if (activityChart[date]) {
        activityChart[date][actionType] = activity.count;
      }
    });
    
    // Convert to array and sort by date
    const chartData = Object.values(activityChart).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: totalUsers,
          images: totalImages,
          collections: totalCollections,
          logins: totalLogins,
          downloads: totalDownloads,
          views: totalViews
        },
        recentActivities,
        chartData,
        topUsersByDownloads,
        topCollectionsByViews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get user login analytics
// @route   GET /api/analytics/logins
// @access  Private/Admin
exports.getLoginAnalytics = async (req, res) => {
  try {
    // Get login analytics by day
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const loginsByDay = await Analytics.aggregate([
      {
        $match: {
          actionType: 'login',
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    // Get logins by user
    const loginsByUser = await Analytics.aggregate([
      {
        $match: { actionType: 'login' }
      },
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 },
          lastLogin: { $max: '$timestamp' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          username: '$userDetails.username',
          count: 1,
          lastLogin: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        loginsByDay,
        loginsByUser
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get download analytics
// @route   GET /api/analytics/downloads
// @access  Private/Admin
exports.getDownloadAnalytics = async (req, res) => {
  try {
    // Get downloads by day
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const downloadsByDay = await Analytics.aggregate([
      {
        $match: {
          actionType: 'download',
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    // Get downloads by image
    const downloadsByImage = await Analytics.aggregate([
      {
        $match: {
          actionType: 'download',
          image: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$image',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 20
      },
      {
        $lookup: {
          from: 'images',
          localField: '_id',
          foreignField: '_id',
          as: 'imageDetails'
        }
      },
      {
        $unwind: '$imageDetails'
      },
      {
        $project: {
          _id: 0,
          imageId: '$_id',
          originalName: '$imageDetails.originalName',
          count: 1
        }
      }
    ]);
    
    // Get downloads by collection
    const downloadsByCollection = await Analytics.aggregate([
      {
        $match: {
          actionType: 'download',
          collection: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$collection',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'collections',
          localField: '_id',
          foreignField: '_id',
          as: 'collectionDetails'
        }
      },
      {
        $unwind: '$collectionDetails'
      },
      {
        $project: {
          _id: 0,
          collectionId: '$_id',
          name: '$collectionDetails.name',
          count: 1
        }
      }
    ]);
    
    // Get downloads by user
    const downloadsByUser = await Analytics.aggregate([
      {
        $match: { actionType: 'download' }
      },
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          username: '$userDetails.username',
          count: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        downloadsByDay,
        downloadsByImage,
        downloadsByCollection,
        downloadsByUser
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get analytics for a specific user
// @route   GET /api/analytics/users/:userId
// @access  Private/Admin
exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Validate that user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Get user's activity summary
    const [loginCount, downloadCount, viewCount] = await Promise.all([
      Analytics.countDocuments({ user: userId, actionType: 'login' }),
      Analytics.countDocuments({ user: userId, actionType: 'download' }),
      Analytics.countDocuments({ user: userId, actionType: 'view' })
    ]);
    
    // Get recent activity for this user
    const recentActivity = await Analytics.find({ user: userId })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('image', 'originalName')
      .populate('collection', 'name');
    
    // Get most viewed collections
    const mostViewedCollections = await Analytics.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          actionType: 'view',
          collection: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$collection',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'collections',
          localField: '_id',
          foreignField: '_id',
          as: 'collectionDetails'
        }
      },
      {
        $unwind: '$collectionDetails'
      },
      {
        $project: {
          _id: 0,
          collectionId: '$_id',
          name: '$collectionDetails.name',
          count: 1
        }
      }
    ]);
    
    // Get most downloaded images
    const mostDownloadedImages = await Analytics.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          actionType: 'download',
          image: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$image',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'images',
          localField: '_id',
          foreignField: '_id',
          as: 'imageDetails'
        }
      },
      {
        $unwind: '$imageDetails'
      },
      {
        $project: {
          _id: 0,
          imageId: '$_id',
          originalName: '$imageDetails.originalName',
          count: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        activitySummary: {
          loginCount,
          downloadCount,
          viewCount,
          totalActions: loginCount + downloadCount + viewCount
        },
        recentActivity,
        mostViewedCollections,
        mostDownloadedImages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};