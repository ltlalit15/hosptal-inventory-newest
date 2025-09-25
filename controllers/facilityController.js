const { pool } = require('../config');

// Get all facilities
const getFacilities = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active', search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = ['1=1'];
    let queryParams = [];

    // Apply filters
    if (status) {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }

    if (search) {
      whereConditions.push('(name LIKE ? OR location LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM facilities WHERE ${whereClause}`,
      queryParams
    );

    // Get facilities with admin info
    const [facilities] = await pool.execute(
      `SELECT f.*, 
              u.name as admin_name, u.email as admin_email,
              (SELECT COUNT(*) FROM users WHERE facility_id = f.id AND status = 'active') as user_count,
              (SELECT COUNT(*) FROM inventory WHERE facility_id = f.id) as inventory_count
       FROM facilities f
       LEFT JOIN users u ON f.id = u.facility_id AND u.role = 'facility_admin' AND u.status = 'active'
       WHERE ${whereClause}
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), parseInt(offset)]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        facilities,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get facilities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get facilities',
      error: error.message
    });
  }
};

// Get facility by ID
const getFacilityById = async (req, res) => {
  try {
    const { id } = req.params;

    const [facilities] = await pool.execute(
      `SELECT f.*, 
              u.name as admin_name, u.email as admin_email, u.phone as admin_phone,
              (SELECT COUNT(*) FROM users WHERE facility_id = f.id AND status = 'active') as user_count,
              (SELECT COUNT(*) FROM inventory WHERE facility_id = f.id) as inventory_count
       FROM facilities f
       LEFT JOIN users u ON f.id = u.facility_id AND u.role = 'facility_admin' AND u.status = 'active'
       WHERE f.id = ?`,
      [id]
    );

    if (facilities.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    res.json({
      success: true,
      data: facilities[0]
    });
  } catch (error) {
    console.error('Get facility by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get facility',
      error: error.message
    });
  }
};

// Create facility
const createFacility = async (req, res) => {
  try {
    const { name, location, type, contact_person, phone, email, address } = req.body;

    // Only super admin can create facilities
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can create facilities'
      });
    }

    // Check if facility name already exists
    const [existingFacilities] = await pool.execute(
      'SELECT id FROM facilities WHERE name = ?',
      [name]
    );

    if (existingFacilities.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Facility with this name already exists'
      });
    }

    // Insert facility
    const [result] = await pool.execute(
      `INSERT INTO facilities (name, location, type, contact_person, phone, email, address, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NOW())`,
      [name, location, type, contact_person || null, phone || null, email || null, address || null]
    );

    // Get created facility
    const [facilities] = await pool.execute(
      'SELECT * FROM facilities WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Facility created successfully',
      data: facilities[0]
    });
  } catch (error) {
    console.error('Create facility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create facility',
      error: error.message
    });
  }
};

// Update facility
const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, type, contact_person, phone, email, address, status } = req.body;

    // Only super admin can update facilities
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can update facilities'
      });
    }

    // Check if facility exists
    const [existingFacilities] = await pool.execute(
      'SELECT id FROM facilities WHERE id = ?',
      [id]
    );

    if (existingFacilities.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    // Update facility
    await pool.execute(
      `UPDATE facilities 
       SET name = ?, location = ?, type = ?, contact_person = ?, phone = ?, email = ?, address = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, location, type, contact_person, phone, email, address, status, id]
    );

    // Get updated facility
    const [facilities] = await pool.execute(
      'SELECT * FROM facilities WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Facility updated successfully',
      data: facilities[0]
    });
  } catch (error) {
    console.error('Update facility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update facility',
      error: error.message
    });
  }
};

// Delete facility (soft delete)
const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;

    // Only super admin can delete facilities
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can delete facilities'
      });
    }

    // Check if facility has active users
    const [activeUsers] = await pool.execute(
      'SELECT COUNT(*) as count FROM users WHERE facility_id = ? AND status = "active"',
      [id]
    );

    if (activeUsers[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete facility with active users. Please deactivate users first.'
      });
    }

    // Soft delete facility
    const [result] = await pool.execute(
      'UPDATE facilities SET status = "deleted", updated_at = NOW() WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    res.json({
      success: true,
      message: 'Facility deleted successfully'
    });
  } catch (error) {
    console.error('Delete facility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete facility',
      error: error.message
    });
  }
};

// Get facility statistics
const getFacilityStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Check access permissions
    if (req.user.role === 'facility_admin' && req.user.facility_id != id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this facility'
      });
    }

    const [stats] = await pool.execute(
      `SELECT 
        (SELECT COUNT(*) FROM users WHERE facility_id = ? AND status = 'active') as active_users,
        (SELECT COUNT(*) FROM inventory WHERE facility_id = ?) as total_items,
        (SELECT SUM(quantity) FROM inventory WHERE facility_id = ?) as total_quantity,
        (SELECT COUNT(*) FROM requisitions WHERE facility_id = ? AND status = 'pending') as pending_requisitions,
        (SELECT COUNT(*) FROM requisitions WHERE facility_id = ? AND DATE(created_at) = CURDATE()) as today_requisitions,
        (SELECT COUNT(*) FROM assets WHERE facility_id = ? AND status = 'active') as active_assets`,
      [id, id, id, id, id, id]
    );

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Get facility stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get facility statistics',
      error: error.message
    });
  }
};

module.exports = {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
  getFacilityStats
};