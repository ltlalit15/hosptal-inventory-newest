const { pool } = require('../config');

// Get inventory items
const getInventory = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      facility_id, 
      search,
      low_stock = false 
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = ['1=1'];
    let queryParams = [];

    // Role-based access control
    if (req.user.role === 'facility_admin' || req.user.role === 'facility_user') {
      whereConditions.push('i.facility_id = ?');
      queryParams.push(req.user.facility_id);
    } else if (facility_id && req.user.role !== 'super_admin') {
      whereConditions.push('i.facility_id = ?');
      queryParams.push(facility_id);
    } else if (facility_id) {
      whereConditions.push('i.facility_id = ?');
      queryParams.push(facility_id);
    }

    // Apply filters
    if (category) {
      whereConditions.push('i.category = ?');
      queryParams.push(category);
    }

    if (search) {
      whereConditions.push('(i.item_name LIKE ? OR i.item_code LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (low_stock === 'true') {
      whereConditions.push('i.quantity <= i.reorder_level');
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM inventory i WHERE ${whereClause}`,
      queryParams
    );

    // Get inventory items
    const [items] = await pool.execute(
      `SELECT i.*, f.name as facility_name, f.location as facility_location,
              CASE WHEN i.quantity <= i.reorder_level THEN 1 ELSE 0 END as is_low_stock
       FROM inventory i
       LEFT JOIN facilities f ON i.facility_id = f.id
       WHERE ${whereClause}
       ORDER BY i.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), parseInt(offset)]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get inventory',
      error: error.message
    });
  }
};

// Get inventory item by ID
const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT i.*, f.name as facility_name, f.location as facility_location,
             CASE WHEN i.quantity <= i.reorder_level THEN 1 ELSE 0 END as is_low_stock
      FROM inventory i
      LEFT JOIN facilities f ON i.facility_id = f.id
      WHERE i.id = ?
    `;

    const queryParams = [id];

    // Role-based access control
    if (req.user.role === 'facility_admin' || req.user.role === 'facility_user') {
      query += ' AND i.facility_id = ?';
      queryParams.push(req.user.facility_id);
    }

    const [items] = await pool.execute(query, queryParams);

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      data: items[0]
    });
  } catch (error) {
    console.error('Get inventory by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get inventory item',
      error: error.message
    });
  }
};

// Create inventory item
const createInventoryItem = async (req, res) => {
  try {
    const { 
      item_code, 
      item_name, 
      category, 
      description, 
      unit, 
      quantity = 0, 
      reorder_level = 0, 
      facility_id 
    } = req.body;

    // Determine facility_id based on user role
    let targetFacilityId = facility_id;
    if (req.user.role === 'facility_admin') {
      targetFacilityId = req.user.facility_id;
    } else if (req.user.role === 'facility_user') {
      return res.status(403).json({
        success: false,
        message: 'Facility users cannot create inventory items'
      });
    }

    // Check if item code already exists in the facility
    const [existingItems] = await pool.execute(
      'SELECT id FROM inventory WHERE item_code = ? AND facility_id = ?',
      [item_code, targetFacilityId]
    );

    if (existingItems.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Item with this code already exists in the facility'
      });
    }

    // Insert inventory item
    const [result] = await pool.execute(
      `INSERT INTO inventory (item_code, item_name, category, description, unit, quantity, reorder_level, facility_id, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [item_code, item_name, category, description || null, unit, quantity, reorder_level, targetFacilityId]
    );

    // Get created item
    const [items] = await pool.execute(
      `SELECT i.*, f.name as facility_name
       FROM inventory i
       LEFT JOIN facilities f ON i.facility_id = f.id
       WHERE i.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: items[0]
    });
  } catch (error) {
    console.error('Create inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create inventory item',
      error: error.message
    });
  }
};

// Update inventory item
const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_name, category, description, unit, quantity, reorder_level } = req.body;

    // Check access permissions
    let query = 'SELECT facility_id FROM inventory WHERE id = ?';
    const queryParams = [id];

    if (req.user.role === 'facility_admin' || req.user.role === 'facility_user') {
      query += ' AND facility_id = ?';
      queryParams.push(req.user.facility_id);
    }

    const [items] = await pool.execute(query, queryParams);

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found or access denied'
      });
    }

    // Facility users can only view, not update
    if (req.user.role === 'facility_user') {
      return res.status(403).json({
        success: false,
        message: 'Facility users cannot update inventory items'
      });
    }

    // Update inventory item
    await pool.execute(
      `UPDATE inventory 
       SET item_name = ?, category = ?, description = ?, unit = ?, quantity = ?, reorder_level = ?, updated_at = NOW()
       WHERE id = ?`,
      [item_name, category, description, unit, quantity, reorder_level, id]
    );

    // Get updated item
    const [updatedItems] = await pool.execute(
      `SELECT i.*, f.name as facility_name
       FROM inventory i
       LEFT JOIN facilities f ON i.facility_id = f.id
       WHERE i.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Inventory item updated successfully',
      data: updatedItems[0]
    });
  } catch (error) {
    console.error('Update inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inventory item',
      error: error.message
    });
  }
};

// Update stock quantity
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, type, remarks } = req.body; // type: 'add', 'subtract', 'set'

    // Check access permissions
    let query = 'SELECT quantity, facility_id FROM inventory WHERE id = ?';
    const queryParams = [id];

    if (req.user.role === 'facility_admin') {
      query += ' AND facility_id = ?';
      queryParams.push(req.user.facility_id);
    } else if (req.user.role === 'facility_user') {
      return res.status(403).json({
        success: false,
        message: 'Facility users cannot update stock'
      });
    }

    const [items] = await pool.execute(query, queryParams);

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found or access denied'
      });
    }

    const currentQuantity = items[0].quantity;
    let newQuantity;

    switch (type) {
      case 'add':
        newQuantity = currentQuantity + quantity;
        break;
      case 'subtract':
        newQuantity = Math.max(0, currentQuantity - quantity);
        break;
      case 'set':
        newQuantity = quantity;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid stock update type'
        });
    }

    // Update stock
    await pool.execute(
      'UPDATE inventory SET quantity = ?, updated_at = NOW() WHERE id = ?',
      [newQuantity, id]
    );

    // Log stock movement
    await pool.execute(
      `INSERT INTO stock_movements (inventory_id, type, quantity, previous_quantity, new_quantity, remarks, user_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [id, type, quantity, currentQuantity, newQuantity, remarks || null, req.user.id]
    );

    // Get updated item
    const [updatedItems] = await pool.execute(
      `SELECT i.*, f.name as facility_name
       FROM inventory i
       LEFT JOIN facilities f ON i.facility_id = f.id
       WHERE i.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: updatedItems[0]
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    });
  }
};

// Delete inventory item
const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Only super admin and warehouse admin can delete items
    if (req.user.role !== 'super_admin' && req.user.role !== 'warehouse_admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to delete inventory items'
      });
    }

    // Check if item has pending requisitions
    const [pendingRequisitions] = await pool.execute(
      'SELECT COUNT(*) as count FROM requisition_items ri JOIN requisitions r ON ri.requisition_id = r.id WHERE ri.item_id = ? AND r.status IN ("pending", "processing", "approved")',
      [id]
    );

    if (pendingRequisitions[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete item with pending requisitions'
      });
    }

    // Delete inventory item
    const [result] = await pool.execute(
      'DELETE FROM inventory WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Delete inventory item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete inventory item',
      error: error.message
    });
  }
};

// Get stock movements
const getStockMovements = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Check access permissions
    let query = 'SELECT facility_id FROM inventory WHERE id = ?';
    const queryParams = [id];

    if (req.user.role === 'facility_admin' || req.user.role === 'facility_user') {
      query += ' AND facility_id = ?';
      queryParams.push(req.user.facility_id);
    }

    const [items] = await pool.execute(query, queryParams);

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found or access denied'
      });
    }

    // Get stock movements
    const [movements] = await pool.execute(
      `SELECT sm.*, u.name as user_name
       FROM stock_movements sm
       LEFT JOIN users u ON sm.user_id = u.id
       WHERE sm.inventory_id = ?
       ORDER BY sm.created_at DESC
       LIMIT ? OFFSET ?`,
      [id, parseInt(limit), parseInt(offset)]
    );

    // Get total count
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM stock_movements WHERE inventory_id = ?',
      [id]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        movements,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get stock movements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stock movements',
      error: error.message
    });
  }
};

// Get categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT DISTINCT category FROM inventory WHERE category IS NOT NULL ORDER BY category'
    );

    res.json({
      success: true,
      data: categories.map(cat => cat.category)
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error.message
    });
  }
};

module.exports = {
  getInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  updateStock,
  deleteInventoryItem,
  getStockMovements,
  getCategories
};