const { pool } = require('../config');

// Get requisitions
const getRequisitions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      facility_id, 
      user_id,
      priority,
      date_from,
      date_to
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = ['1=1'];
    let queryParams = [];

    // Role-based access control
    if (req.user.role === 'facility_admin') {
      whereConditions.push('r.facility_id = ?');
      queryParams.push(req.user.facility_id);
    } else if (req.user.role === 'facility_user') {
      whereConditions.push('r.user_id = ?');
      queryParams.push(req.user.id);
    }

    // Apply filters
    if (status) {
      whereConditions.push('r.status = ?');
      queryParams.push(status);
    }

    if (facility_id && req.user.role === 'super_admin') {
      whereConditions.push('r.facility_id = ?');
      queryParams.push(facility_id);
    }

    if (user_id && (req.user.role === 'super_admin' || req.user.role === 'facility_admin')) {
      whereConditions.push('r.user_id = ?');
      queryParams.push(user_id);
    }

    if (priority) {
      whereConditions.push('r.priority = ?');
      queryParams.push(priority);
    }

    if (date_from) {
      whereConditions.push('DATE(r.created_at) >= ?');
      queryParams.push(date_from);
    }

    if (date_to) {
      whereConditions.push('DATE(r.created_at) <= ?');
      queryParams.push(date_to);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM requisitions r WHERE ${whereClause}`,
      queryParams
    );

    // Get requisitions with details
    const [requisitions] = await pool.execute(
      `SELECT r.*, 
              u.name as user_name, u.email as user_email,
              f.name as facility_name, f.location as facility_location,
              (SELECT COUNT(*) FROM requisition_items WHERE requisition_id = r.id) as item_count,
              (SELECT SUM(quantity) FROM requisition_items WHERE requisition_id = r.id) as total_quantity
       FROM requisitions r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN facilities f ON r.facility_id = f.id
       WHERE ${whereClause}
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), parseInt(offset)]
    );

    // Get items for each requisition
    for (let requisition of requisitions) {
      const [items] = await pool.execute(
        `SELECT ri.*, i.item_name, i.item_code, i.unit
         FROM requisition_items ri
         LEFT JOIN inventory i ON ri.item_id = i.id
         WHERE ri.requisition_id = ?`,
        [requisition.id]
      );
      requisition.items = items;
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        requisitions,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get requisitions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get requisitions',
      error: error.message
    });
  }
};

// Get requisition by ID
const getRequisitionById = async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT r.*, 
             u.name as user_name, u.email as user_email, u.phone as user_phone,
             f.name as facility_name, f.location as facility_location
      FROM requisitions r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN facilities f ON r.facility_id = f.id
      WHERE r.id = ?
    `;

    const queryParams = [id];

    // Role-based access control
    if (req.user.role === 'facility_admin') {
      query += ' AND r.facility_id = ?';
      queryParams.push(req.user.facility_id);
    } else if (req.user.role === 'facility_user') {
      query += ' AND r.user_id = ?';
      queryParams.push(req.user.id);
    }

    const [requisitions] = await pool.execute(query, queryParams);

    if (requisitions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Requisition not found or access denied'
      });
    }

    // Get requisition items
    const [items] = await pool.execute(
      `SELECT ri.*, i.item_name, i.item_code, i.unit, i.quantity as available_quantity
       FROM requisition_items ri
       LEFT JOIN inventory i ON ri.item_id = i.id
       WHERE ri.requisition_id = ?`,
      [id]
    );

    const requisition = requisitions[0];
    requisition.items = items;

    res.json({
      success: true,
      data: requisition
    });
  } catch (error) {
    console.error('Get requisition by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get requisition',
      error: error.message
    });
  }
};

// Create requisition
const createRequisition = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { items, remarks, facility_id, priority = 'normal' } = req.body;

    // Determine facility_id based on user role
    let targetFacilityId = facility_id;
    if (req.user.role === 'facility_admin' || req.user.role === 'facility_user') {
      targetFacilityId = req.user.facility_id;
    }

    // Create requisition
    const [requisitionResult] = await connection.execute(
      `INSERT INTO requisitions (user_id, facility_id, status, priority, remarks, created_at) 
       VALUES (?, ?, 'pending', ?, ?, NOW())`,
      [req.user.id, targetFacilityId, priority, remarks || null]
    );

    const requisitionId = requisitionResult.insertId;

    // Add requisition items
    for (const item of items) {
      await connection.execute(
        `INSERT INTO requisition_items (requisition_id, item_id, quantity, priority) 
         VALUES (?, ?, ?, ?)`,
        [requisitionId, item.item_id, item.quantity, item.priority || priority]
      );
    }

    await connection.commit();

    // Get created requisition with details
    const [requisitions] = await pool.execute(
      `SELECT r.*, 
              u.name as user_name, f.name as facility_name
       FROM requisitions r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN facilities f ON r.facility_id = f.id
       WHERE r.id = ?`,
      [requisitionId]
    );

    // Get requisition items
    const [requisitionItems] = await pool.execute(
      `SELECT ri.*, i.item_name, i.item_code, i.unit
       FROM requisition_items ri
       LEFT JOIN inventory i ON ri.item_id = i.id
       WHERE ri.requisition_id = ?`,
      [requisitionId]
    );

    const requisition = requisitions[0];
    requisition.items = requisitionItems;

    res.status(201).json({
      success: true,
      message: 'Requisition created successfully',
      data: requisition
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create requisition error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create requisition',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Update requisition
const updateRequisition = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, approved_quantity } = req.body;

    // Check access permissions
    let query = 'SELECT user_id, facility_id, status as current_status FROM requisitions WHERE id = ?';
    const queryParams = [id];

    if (req.user.role === 'facility_admin') {
      query += ' AND facility_id = ?';
      queryParams.push(req.user.facility_id);
    } else if (req.user.role === 'facility_user') {
      query += ' AND user_id = ?';
      queryParams.push(req.user.id);
    }

    const [requisitions] = await pool.execute(query, queryParams);

    if (requisitions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Requisition not found or access denied'
      });
    }

    // Facility users can only update pending requisitions
    if (req.user.role === 'facility_user' && requisitions[0].current_status !== 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Cannot update requisition in current status'
      });
    }

    // Update requisition
    await pool.execute(
      'UPDATE requisitions SET status = ?, remarks = ?, updated_at = NOW() WHERE id = ?',
      [status, remarks, id]
    );

    // Get updated requisition
    const [updatedRequisitions] = await pool.execute(
      `SELECT r.*, 
              u.name as user_name, f.name as facility_name
       FROM requisitions r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN facilities f ON r.facility_id = f.id
       WHERE r.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Requisition updated successfully',
      data: updatedRequisitions[0]
    });
  } catch (error) {
    console.error('Update requisition error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update requisition',
      error: error.message
    });
  }
};

// Approve requisition (warehouse admin)
const approveRequisition = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { items, remarks } = req.body; // items: [{ item_id, approved_quantity }]

    // Get requisition details
    const [requisitions] = await connection.execute(
      'SELECT facility_id, status FROM requisitions WHERE id = ?',
      [id]
    );

    if (requisitions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Requisition not found'
      });
    }

    if (requisitions[0].status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Requisition is not in pending status'
      });
    }

    // Update requisition status
    await connection.execute(
      'UPDATE requisitions SET status = "approved", approved_by = ?, approved_at = NOW(), remarks = ? WHERE id = ?',
      [req.user.id, remarks || null, id]
    );

    // Update approved quantities for items
    for (const item of items) {
      await connection.execute(
        'UPDATE requisition_items SET approved_quantity = ? WHERE requisition_id = ? AND item_id = ?',
        [item.approved_quantity, id, item.item_id]
      );

      // Reduce warehouse stock (assuming warehouse has facility_id = null or specific warehouse facility)
      await connection.execute(
        'UPDATE inventory SET quantity = quantity - ? WHERE item_id = ? AND facility_id IS NULL',
        [item.approved_quantity, item.item_id]
      );
    }

    // Create dispatch record
    await connection.execute(
      `INSERT INTO dispatches (requisition_id, facility_id, status, dispatched_by, created_at) 
       VALUES (?, ?, 'in_transit', ?, NOW())`,
      [id, requisitions[0].facility_id, req.user.id]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Requisition approved and dispatched successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Approve requisition error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve requisition',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Deliver requisition (facility admin)
const deliverRequisition = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { items, remarks } = req.body; // items: [{ item_id, delivered_quantity }]

    // Check if requisition belongs to facility
    const [requisitions] = await connection.execute(
      'SELECT facility_id, status FROM requisitions WHERE id = ? AND facility_id = ?',
      [id, req.user.facility_id]
    );

    if (requisitions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Requisition not found or access denied'
      });
    }

    if (requisitions[0].status !== 'dispatched') {
      return res.status(400).json({
        success: false,
        message: 'Requisition is not in dispatched status'
      });
    }

    // Update requisition status
    await connection.execute(
      'UPDATE requisitions SET status = "delivered", delivered_by = ?, delivered_at = NOW(), remarks = ? WHERE id = ?',
      [req.user.id, remarks || null, id]
    );

    // Update delivered quantities and facility stock
    for (const item of items) {
      await connection.execute(
        'UPDATE requisition_items SET delivered_quantity = ? WHERE requisition_id = ? AND item_id = ?',
        [item.delivered_quantity, id, item.item_id]
      );

      // Increase facility stock
      await connection.execute(
        'UPDATE inventory SET quantity = quantity + ? WHERE item_id = ? AND facility_id = ?',
        [item.delivered_quantity, item.item_id, req.user.facility_id]
      );
    }

    // Update dispatch status
    await connection.execute(
      'UPDATE dispatches SET status = "delivered", delivered_at = NOW() WHERE requisition_id = ?',
      [id]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Requisition delivered successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Deliver requisition error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deliver requisition',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Delete requisition
const deleteRequisition = async (req, res) => {
  try {
    const { id } = req.params;

    // Check access permissions
    let query = 'SELECT user_id, facility_id, status FROM requisitions WHERE id = ?';
    const queryParams = [id];

    if (req.user.role === 'facility_user') {
      query += ' AND user_id = ?';
      queryParams.push(req.user.id);
    } else if (req.user.role === 'facility_admin') {
      query += ' AND facility_id = ?';
      queryParams.push(req.user.facility_id);
    }

    const [requisitions] = await pool.execute(query, queryParams);

    if (requisitions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Requisition not found or access denied'
      });
    }

    // Can only delete pending requisitions
    if (requisitions[0].status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete pending requisitions'
      });
    }

    // Delete requisition (cascade will delete items)
    await pool.execute('DELETE FROM requisitions WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Requisition deleted successfully'
    });
  } catch (error) {
    console.error('Delete requisition error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete requisition',
      error: error.message
    });
  }
};

module.exports = {
  getRequisitions,
  getRequisitionById,
  createRequisition,
  updateRequisition,
  approveRequisition,
  deliverRequisition,
  deleteRequisition
};