const jwt = require('jsonwebtoken');
const { pool } = require('../config');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user details from database
    const [users] = await pool.execute(
      'SELECT id, email, role, facility_id, status FROM users WHERE id = ? AND status = "active"',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Check user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check if user belongs to facility (for facility-specific operations)
const checkFacilityAccess = async (req, res, next) => {
  try {
    const facilityId = req.params.facilityId || req.body.facility_id;
    
    if (!facilityId) {
      return next();
    }

    // Super Admin can access all facilities
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Warehouse Admin can access all facilities for dispatch operations
    if (req.user.role === 'warehouse_admin') {
      return next();
    }

    // Facility Admin and Users can only access their own facility
    if (req.user.facility_id != facilityId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this facility'
      });
    }

    next();
  } catch (error) {
    console.error('Facility access check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authorization error'
    });
  }
};

module.exports = {
  authenticateToken,
  authorize,
  checkFacilityAccess
};