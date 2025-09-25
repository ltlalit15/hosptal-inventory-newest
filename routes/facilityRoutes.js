const express = require('express');
const { validate, facilitySchemas } = require('../middleware/validation');
const { authenticateToken, authorize } = require('../middleware/auth');
const {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
  getFacilityStats
} = require('../controllers/facilityController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all facilities
router.get('/', getFacilities);

// Get facility by ID
router.get('/:id', getFacilityById);

// Get facility statistics
router.get('/:id/stats', getFacilityStats);

// Create facility
router.post('/', authorize('super_admin'), validate(facilitySchemas.create), createFacility);

// Update facility
router.put('/:id', authorize('super_admin'), validate(facilitySchemas.update), updateFacility);

// Delete facility
router.delete('/:id', authorize('super_admin'), deleteFacility);

module.exports = router;