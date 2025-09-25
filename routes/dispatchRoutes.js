const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const {
  getDispatches,
  getDispatchById,
  createDispatch,
  updateDispatchStatus,
  confirmDelivery
} = require('../controllers/dispatchController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all dispatches
router.get('/', getDispatches);

// Get dispatch by ID
router.get('/:id', getDispatchById);

// Create dispatch (warehouse admin)
router.post('/', authorize('warehouse_admin', 'super_admin'), createDispatch);

// Update dispatch status
router.patch('/:id/status', authorize('warehouse_admin', 'super_admin'), updateDispatchStatus);

// Confirm delivery (facility admin)
router.patch('/:id/confirm', authorize('facility_admin', 'super_admin'), confirmDelivery);

module.exports = router;