const express = require('express');
const { validate, userSchemas } = require('../middleware/validation');
const { authenticateToken, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all users
router.get('/', authorize('super_admin', 'facility_admin'), getUsers);

// Get user by ID
router.get('/:id', getUserById);

// Create user
router.post('/', authorize('super_admin', 'facility_admin'), validate(userSchemas.register), createUser);

// Update user
router.put('/:id', validate(userSchemas.update), updateUser);

// Delete user
router.delete('/:id', authorize('super_admin'), deleteUser);

module.exports = router;