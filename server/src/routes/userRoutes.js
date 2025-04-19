const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  bulkCreateUsers,
  bulkDeleteUsers
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { verifyAuth0Token, requireAdmin } = require('../middleware/auth0');

const router = express.Router();

// Auth options:
// Option 1: JWT from our own server
// router.use(protect);
// router.use(authorize('admin'));

// Option 2: Auth0 JWT verification 
// Comment/uncomment as needed for testing
// router.use(verifyAuth0Token);
// router.use(requireAdmin);

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/bulk')
  .post(bulkCreateUsers)
  .delete(bulkDeleteUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;