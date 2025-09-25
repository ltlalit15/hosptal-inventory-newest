const bcrypt = require('bcryptjs');
const { pool } = require('../config');

// Get all users (with filtering and pagination)
const getUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      role, 
      facility_id, 
      status = 'active',
      search 
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = ['1=1'];
    let queryParams = [];

    // Role-based access control
    if (req.user.role === 'facility_admin') {
      whereConditions.push('u.facility_id = ?');
      queryParams.push(req.user.facility_id);
    } else if (req.user.role === 'facility_user') {
      whereConditions.push('u.facility_id = ? AND u.id = ?');
      queryParams.push(req.user.facility_id, req.user.id);
    }

    // Apply filters
    if (role) {
      whereConditions.push('u.role = ?');
      queryParams.push(role);
    }

    if (facility_id && req.user.role === 'super_admin') {
      whereConditions.push('u.facility_id = ?');
      queryParams.push(facility_id);
    }

    if (status) {
      whereConditions.push('u.status = ?');
      queryParams.push(status);
    }

    if (search) {
      whereConditions.push('(u.name LIKE ? OR u.email LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM users u WHERE ${whereClause}`,
      queryParams
    );

    // Get users
    const [users] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role, u.facility_id, u.phone, u.department, u.status, u.created_at, u.last_login,
              f.name as facility_name, f.location as facility_location
       FROM users u
       LEFT JOIN facilities f ON u.facility_id = f.id
       WHERE ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), parseInt(offset)]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check access permissions
    if (req.user.role === 'facility_user' && req.user.id != id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    let query = `
      SELECT u.id, u.name, u.email, u.role, u.facility_id, u.phone, u.department, u.status, u.created_at, u.last_login,
             f.name as facility_name, f.location as facility_location
      FROM users u
      LEFT JOIN facilities f ON u.facility_id = f.id
      WHERE u.id = ?
    `;

    const queryParams = [id];

    // Facility admin can only see users from their facility
    if (req.user.role === 'facility_admin') {
      query += ' AND u.facility_id = ?';
      queryParams.push(req.user.facility_id);
    }

    const [users] = await pool.execute(query, queryParams);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    });
  }
};

// Create user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, facility_id, phone, department } = req.body;

    // Role-based access control for user creation
    if (req.user.role === 'facility_admin') {
      // Facility admin can only create facility users in their facility
      if (role !== 'facility_user' || facility_id != req.user.facility_id) {
        return res.status(403).json({
          success: false,
          message: 'You can only create facility users in your facility'
        });
      }
    } else if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to create users'
      });
    }

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password, role, facility_id, phone, department, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NOW())`,
      [name, email, hashedPassword, role, facility_id || null, phone || null, department || null]
    );

    // Get created user
    const [users] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role, u.facility_id, u.phone, u.department, u.status, u.created_at,
              f.name as facility_name
       FROM users u
       LEFT JOIN facilities f ON u.facility_id = f.id
       WHERE u.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: users[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, department, status } = req.body;

    // Check access permissions
    if (req.user.role === 'facility_admin') {
      // Check if user belongs to the same facility
      const [userCheck] = await pool.execute(
        'SELECT facility_id FROM users WHERE id = ?',
        [id]
      );

      if (userCheck.length === 0 || userCheck[0].facility_id != req.user.facility_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } else if (req.user.role === 'facility_user' && req.user.id != id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }

    // Update user
    await pool.execute(
      'UPDATE users SET name = ?, phone = ?, department = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [name, phone, department, status, id]
    );

    // Get updated user
    const [users] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role, u.facility_id, u.phone, u.department, u.status,
              f.name as facility_name
       FROM users u
       LEFT JOIN facilities f ON u.facility_id = f.id
       WHERE u.id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: users[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete user (soft delete)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Only super admin can delete users
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can delete users'
      });
    }

    // Cannot delete self
    if (req.user.id == id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Soft delete user
    const [result] = await pool.execute(
      'UPDATE users SET status = "deleted", updated_at = NOW() WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};