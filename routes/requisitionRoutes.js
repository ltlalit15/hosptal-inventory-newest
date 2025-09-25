const express = require('express');
const { validate, requisitionSchemas } = require('../middleware/validation');
const { authenticateToken, authorize, checkFacilityAccess } = require('../middleware/auth');
const {
  getRequisitions,
  getRequisitionById,
  createRequisition,
  updateRequisition,
  deleteRequisition,
  approveRequisition,
  deliverRequisition
} = require('../controllers/requisitionController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all requisitions
router.get('/', getRequisitions);

// Get requisition by ID
router.get('/:id', getRequisitionById);

// Create requisition
router.post('/', validate(requisitionSchemas.create), createRequisition);

// Update requisition
router.put('/:id', validate(requisitionSchemas.update), updateRequisition);

// Approve requisition (warehouse admin)
router.patch('/:id/approve', authorize('warehouse_admin', 'super_admin'), approveRequisition);

// Deliver requisition (facility admin)
router.patch('/:id/deliver', authorize('facility_admin', 'super_admin'), deliverRequisition);

// Delete requisition
router.delete('/:id', deleteRequisition);

module.exports = router;