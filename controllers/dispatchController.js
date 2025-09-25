const { pool } = require('../config');

// Get dispatches
const getDispatches = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      facility_id,
      date_from,
      date_to
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = ['1=1'];
    let queryParams = [];

    // Role-based access control
    if (req.user.role === 'facility_admin') {
      whereConditions.push('d.facility_id = ?');
      queryParams.push(req.user.facility_id);
    }

    // Apply filters
    if (status) {
      whereConditions.push('d.status = ?');
      queryParams.push(status);
    }

    if (facility_id && req.user.role !== 'facility_admin') {
      whereConditions.push('d.facility_id = ?');
      queryParams.push(facility_id);
    }

    if (date_from) {
      whereConditions.push('DATE(d.created_at) >= ?');
      queryParams.push(date_from);
    }

    if (date_to) {
      whereConditions.push('DATE(d.created_at) <= ?');
      queryParams.push(date_to);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM dispatches d WHERE ${whereClause}`,
      queryParams
    );

    // Get dispatches with details
    const [dispatches] = await pool.execute(
      `SELECT d.*, 
              f.name as facility_name, f.location as facility_location,
              u1.name as dispatched_by_name,
              u2.name as received_by_name,
              r.id as requisition_id, r.priority as requisition_priority,
              (SELECT COUNT(*) FROM requisition_items WHERE requisition_id = r.id) as item_count
       FROM dispatches d
       LEFT JOIN facilities f ON d.facility_id = f.id
       LEFT JOIN users u1 ON d.dispatched_by = u1.id
       LEFT JOIN users u2 ON d.received_by = u2.id
       LEFT JOIN requisitions r ON d.requisition_id = r.id
       WHERE ${whereClause}
       ORDER BY d.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), parseInt(offset)]
    );

    // Get items for each dispatch
    for (let dispatch of dispatches) {
      if (dispatch.requisition_id) {
        const [items] = await pool.execute(
          `SELECT ri.*, i.item_name, i.item_code, i.unit
           FROM requisition_items ri
           LEFT JOIN inventory i ON ri.item_id = i.id
           WHERE ri.requisition_id = ?`,
          [dispatch.requisition_id]
        );
        dispatch.items = items;
      }
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        dispatches,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get dispatches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dispatches',
      error: error.message
    });
  }
};

// Get dispatch by ID
const getDispatchById = async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT d.*, 
             f.name as facility_name, f.location as facility_location,
             u1.name as dispatched_by_name, u1.email as dispatched_by_email,
             u2.name as received_by_name, u2.email as received_by_email,
             r.id as requisition_id, r.priority as requisition_priority, r.remarks as requisition_remarks
      FROM dispatches d
      LEFT JOIN facilities f ON d.facility_id = f.id
      LEFT JOIN users u1 ON d.dispatched_by = u1.id
      LEFT JOIN users u2 ON d.received_by = u2.id
      LEFT JOIN requisitions r ON d.requisition_id = r.id
      WHERE d.id = ?
    `;

    const queryParams = [id];

    // Role-based access control
    if (req.user.role === 'facility_admin') {
      query += ' AND d.facility_id = ?';
      queryParams.push(req.user.facility_id);
    }

    const [dispatches] = await pool.execute(query, queryParams);

    if (dispatches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dispatch not found or access denied'
      });
    }

    // Get dispatch items
    if (dispatches[0].requisition_id) {
      const [items] = await pool.execute(
        `SELECT ri.*, i.item_name, i.item_code, i.unit
         FROM requisition_items ri
         LEFT JOIN inventory i ON ri.item_id = i.id
         WHERE ri.requisition_id = ?`,
        [dispatches[0].requisition_id]
      );
      dispatches[0].items = items;
    }

    res.json({
      success: true,
      data: dispatches[0]
    });
  } catch (error) {
    console.error('Get dispatch by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dispatch',
      error: error.message
    });
  }
};

// Create dispatch
const createDispatch = async (req, res) => {
  try {
    const { requisition_id, facility_id, remarks, tracking_number } = req.body;

    // Verify requisition exists and is approved
    const [requisitions] = await pool.execute(
      'SELECT id, status FROM requisitions WHERE id = ? AND status = "approved"',
      [requisition_id]
    );

    if (requisitions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Approved requisition not found'
      });
    }

    // Check if dispatch already exists for this requisition
    const [existingDispatches] = await pool.execute(
      'SELECT id FROM dispatches WHERE requisition_id = ?',
      [requisition_id]
    );

    if (existingDispatches.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Dispatch already exists for this requisition'
      });
    }

    // Create dispatch
    const [result] = await pool.execute(
      `INSERT INTO dispatches (requisition_id, facility_id, status, dispatched_by, tracking_number, remarks, created_at) 
       VALUES (?, ?, 'in_transit', ?, ?, ?, NOW())`,
      [requisition_id, facility_id, req.user.id, tracking_number || null, remarks || null]
    );

    // Update requisition status
    await pool.execute(
      'UPDATE requisitions SET status = "dispatched" WHERE id = ?',
      [requisition_id]
    );

    // Get created dispatch
    const [dispatches] = await pool.execute(
      `SELECT d.*, 
              f.name as facility_name, u.name as dispatched_by_name
       FROM dispatches d
       LEFT JOIN facilities f ON d.facility_id = f.id
       LEFT JOIN users u ON d.dispatched_by = u.id
       WHERE d.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Dispatch created successfully',
      data: dispatches[0]
    });
  } catch (error) {
    console.error('Create dispatch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create dispatch',
      error: error.message
    });
  }
};

// Update dispatch status
const updateDispatchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, tracking_number } = req.body;

    // Valid status transitions
    const validStatuses = ['in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dispatch status'
      });
    }

    // Update dispatch
    await pool.execute(
      'UPDATE dispatches SET status = ?, remarks = ?, tracking_number = ?, updated_at = NOW() WHERE id = ?',
      [status, remarks, tracking_number, id]
    );

    // If cancelled, update requisition status
    if (status === 'cancelled') {
      const [dispatches] = await pool.execute(
        'SELECT requisition_id FROM dispatches WHERE id = ?',
        [id]
      );
      
      if (dispatches.length > 0) {
        await pool.execute(
          'UPDATE requisitions SET status = "approved" WHERE id = ?',
          [dispatches[0].requisition_id]
        );
      }
    }

    // Get updated dispatch
    const [updatedDispatches] = await pool.execute(
      `SELECT d.*, 
              f.name as facility_name, u.name as dispatched_by_name
       FROM dispatches d
       LEFT JOIN facilities f ON d.facility_id = f.id
       LEFT JOIN users u ON d.dispatched_by = u.id
       WHERE d.id = ?`,
      [id]
    );

    if (updatedDispatches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dispatch not found'
      });
    }

    res.json({
      success: true,
      message: 'Dispatch status updated successfully',
      data: updatedDispatches[0]
    });
  } catch (error) {
    console.error('Update dispatch status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update dispatch status',
      error: error.message
    });
  }
};

// Confirm delivery (facility admin)
const confirmDelivery = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { remarks } = req.body;

    // Get dispatch details
    const [dispatches] = await connection.execute(
      'SELECT requisition_id, facility_id, status FROM dispatches WHERE id = ? AND facility_id = ?',
      [id, req.user.facility_id]
    );

    if (dispatches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dispatch not found or access denied'
      });
    }

    if (dispatches[0].status !== 'in_transit') {
      return res.status(400).json({
        success: false,
        message: 'Dispatch is not in transit'
      });
    }

    // Update dispatch status
    await connection.execute(
      'UPDATE dispatches SET status = "delivered", received_by = ?, delivered_at = NOW(), remarks = ? WHERE id = ?',
      [req.user.id, remarks || null, id]
    );

    // Update requisition status
    await connection.execute(
      'UPDATE requisitions SET status = "delivered" WHERE id = ?',
      [dispatches[0].requisition_id]
    );

    // Get requisition items and update facility inventory
    const [items] = await connection.execute(
      'SELECT item_id, approved_quantity FROM requisition_items WHERE requisition_id = ?',
      [dispatches[0].requisition_id]
    );

    for (const item of items) {
      // Check if item exists in facility inventory
      const [facilityItems] = await connection.execute(
        'SELECT id, quantity FROM inventory WHERE item_id = ? AND facility_id = ?',
        [item.item_id, req.user.facility_id]
      );

      if (facilityItems.length > 0) {
        // Update existing inventory
        await connection.execute(
          'UPDATE inventory SET quantity = quantity + ? WHERE item_id = ? AND facility_id = ?',
          [item.approved_quantity, item.item_id, req.user.facility_id]
        );
      } else {
        // Create new inventory record for facility
        const [masterItem] = await connection.execute(
          'SELECT item_code, item_name, category, description, unit FROM inventory WHERE item_id = ? LIMIT 1',
          [item.item_id]
        );

        if (masterItem.length > 0) {
          await connection.execute(
            `INSERT INTO inventory (item_code, item_name, category, description, unit, quantity, facility_id, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
              masterItem[0].item_code,
              masterItem[0].item_name,
              masterItem[0].category,
              masterItem[0].description,
              masterItem[0].unit,
              item.approved_quantity,
              req.user.facility_id
            ]
          );
        }
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Delivery confirmed successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Confirm delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm delivery',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getDispatches,
  getDispatchById,
  createDispatch,
  updateDispatchStatus,
  confirmDelivery
};