const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  getSuperAdminDashboard,
  getWarehouseAdminDashboard,
  getFacilityAdminDashboard,
  getFacilityUserDashboard
} = require('../controllers/dashboardController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get dashboard data based on user role
router.get('/', (req, res) => {
  switch (req.user.role) {
    case 'super_admin':
      return getSuperAdminDashboard(req, res);
    case 'warehouse_admin':
      return getWarehouseAdminDashboard(req, res);
    case 'facility_admin':
      return getFacilityAdminDashboard(req, res);
    case 'facility_user':
      return getFacilityUserDashboard(req, res);
    default:
      return res.status(403).json({
        success: false,
        message: 'Invalid user role'
      });
  }
});

module.exports = router;