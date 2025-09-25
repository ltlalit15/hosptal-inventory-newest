const { pool } = require('../config');

// Super Admin Dashboard
const getSuperAdminDashboard = async (req, res) => {
  try {
    // Get overall statistics
    const [stats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM facilities WHERE status = 'active') as total_facilities,
        (SELECT COUNT(*) FROM users WHERE status = 'active') as total_users,
        (SELECT COUNT(*) FROM inventory) as total_inventory_items,
        (SELECT SUM(quantity) FROM inventory) as total_stock_quantity,
        (SELECT COUNT(*) FROM requisitions WHERE status = 'pending') as pending_requisitions,
        (SELECT COUNT(*) FROM requisitions WHERE DATE(created_at) = CURDATE()) as today_requisitions,
        (SELECT COUNT(*) FROM dispatches WHERE status = 'in_transit') as in_transit_dispatches,
        (SELECT COUNT(*) FROM assets WHERE status = 'active') as total_assets,
        (SELECT COUNT(*) FROM inventory WHERE quantity <= reorder_level) as low_stock_items
    `);

    // Get recent activities
    const [recentRequisitions] = await pool.execute(`
      SELECT r.id, r.status, r.priority, r.created_at,
             u.name as user_name, f.name as facility_name,
             (SELECT COUNT(*) FROM requisition_items WHERE requisition_id = r.id) as item_count
      FROM requisitions r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN facilities f ON r.facility_id = f.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `);

    // Get facility-wise statistics
    const [facilityStats] = await pool.execute(`
      SELECT f.name, f.location,
             COUNT(DISTINCT u.id) as user_count,
             COUNT(DISTINCT i.id) as inventory_count,
             COUNT(DISTINCT r.id) as requisition_count,
             COUNT(DISTINCT a.id) as asset_count
      FROM facilities f
      LEFT JOIN users u ON f.id = u.facility_id AND u.status = 'active'
      LEFT JOIN inventory i ON f.id = i.facility_id
      LEFT JOIN requisitions r ON f.id = r.facility_id AND DATE(r.created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      LEFT JOIN assets a ON f.id = a.facility_id AND a.status = 'active'
      WHERE f.status = 'active'
      GROUP BY f.id, f.name, f.location
      ORDER BY requisition_count DESC
      LIMIT 10
    `);

    // Get monthly requisition trends
    const [monthlyTrends] = await pool.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as requisition_count,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_count
      FROM requisitions
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `);

    res.json({
      success: true,
      data: {
        stats: stats[0],
        recent_requisitions: recentRequisitions,
        facility_stats: facilityStats,
        monthly_trends: monthlyTrends.reverse()
      }
    });
  } catch (error) {
    console.error('Super admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data',
      error: error.message
    });
  }
};

// Warehouse Admin Dashboard
const getWarehouseAdminDashboard = async (req, res) => {
  try {
    // Get warehouse statistics
    const [stats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM inventory WHERE facility_id IS NULL) as warehouse_items,
        (SELECT SUM(quantity) FROM inventory WHERE facility_id IS NULL) as total_stock,
        (SELECT COUNT(*) FROM inventory WHERE facility_id IS NULL AND quantity <= reorder_level) as low_stock_items,
        (SELECT COUNT(*) FROM requisitions WHERE status = 'pending') as pending_approvals,
        (SELECT COUNT(*) FROM dispatches WHERE status = 'in_transit') as in_transit_dispatches,
        (SELECT COUNT(*) FROM dispatches WHERE DATE(created_at) = CURDATE()) as today_dispatches,
        (SELECT COUNT(*) FROM assets WHERE facility_id IS NULL AND status = 'active') as warehouse_assets
    `);

    // Get pending requisitions for approval
    const [pendingRequisitions] = await pool.execute(`
      SELECT r.id, r.priority, r.created_at,
             u.name as user_name, f.name as facility_name,
             (SELECT COUNT(*) FROM requisition_items WHERE requisition_id = r.id) as item_count,
             (SELECT SUM(quantity) FROM requisition_items WHERE requisition_id = r.id) as total_quantity
      FROM requisitions r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN facilities f ON r.facility_id = f.id
      WHERE r.status = 'pending'
      ORDER BY 
        CASE r.priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          ELSE 3 
        END,
        r.created_at ASC
      LIMIT 10
    `);

    // Get low stock alerts
    const [lowStockItems] = await pool.execute(`
      SELECT item_code, item_name, category, quantity, reorder_level,
             (reorder_level - quantity) as shortage
      FROM inventory
      WHERE facility_id IS NULL AND quantity <= reorder_level
      ORDER BY (quantity / NULLIF(reorder_level, 0)) ASC
      LIMIT 10
    `);

    // Get dispatch statistics by facility
    const [facilityDispatchStats] = await pool.execute(`
      SELECT f.name as facility_name,
             COUNT(d.id) as total_dispatches,
             COUNT(CASE WHEN d.status = 'delivered' THEN 1 END) as delivered_count,
             COUNT(CASE WHEN d.status = 'in_transit' THEN 1 END) as in_transit_count
      FROM facilities f
      LEFT JOIN dispatches d ON f.id = d.facility_id AND DATE(d.created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      WHERE f.status = 'active'
      GROUP BY f.id, f.name
      ORDER BY total_dispatches DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        stats: stats[0],
        pending_requisitions: pendingRequisitions,
        low_stock_items: lowStockItems,
        facility_dispatch_stats: facilityDispatchStats
      }
    });
  } catch (error) {
    console.error('Warehouse admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data',
      error: error.message
    });
  }
};

// Facility Admin Dashboard
const getFacilityAdminDashboard = async (req, res) => {
  try {
    const facilityId = req.user.facility_id;

    // Get facility statistics
    const [stats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM inventory WHERE facility_id = ?) as facility_items,
        (SELECT SUM(quantity) FROM inventory WHERE facility_id = ?) as total_stock,
        (SELECT COUNT(*) FROM inventory WHERE facility_id = ? AND quantity <= reorder_level) as low_stock_items,
        (SELECT COUNT(*) FROM requisitions WHERE facility_id = ? AND status = 'pending') as pending_user_requests,
        (SELECT COUNT(*) FROM requisitions WHERE facility_id = ? AND DATE(created_at) = CURDATE()) as today_requests,
        (SELECT COUNT(*) FROM dispatches WHERE facility_id = ? AND status = 'in_transit') as incoming_dispatches,
        (SELECT COUNT(*) FROM users WHERE facility_id = ? AND status = 'active') as facility_users,
        (SELECT COUNT(*) FROM assets WHERE facility_id = ? AND status = 'active') as facility_assets
    `, [facilityId, facilityId, facilityId, facilityId, facilityId, facilityId, facilityId, facilityId]);

    // Get pending user requisitions
    const [pendingRequests] = await pool.execute(`
      SELECT r.id, r.priority, r.created_at,
             u.name as user_name, u.department,
             (SELECT COUNT(*) FROM requisition_items WHERE requisition_id = r.id) as item_count,
             (SELECT SUM(quantity) FROM requisition_items WHERE requisition_id = r.id) as total_quantity
      FROM requisitions r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.facility_id = ? AND r.status = 'pending'
      ORDER BY 
        CASE r.priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          ELSE 3 
        END,
        r.created_at ASC
      LIMIT 10
    `, [facilityId]);

    // Get low stock items in facility
    const [lowStockItems] = await pool.execute(`
      SELECT item_code, item_name, category, quantity, reorder_level,
             (reorder_level - quantity) as shortage
      FROM inventory
      WHERE facility_id = ? AND quantity <= reorder_level
      ORDER BY (quantity / NULLIF(reorder_level, 0)) ASC
      LIMIT 10
    `, [facilityId]);

    // Get top requested items
    const [topRequestedItems] = await pool.execute(`
      SELECT i.item_name, i.category, SUM(ri.quantity) as total_requested,
             COUNT(ri.id) as request_count
      FROM requisition_items ri
      JOIN inventory i ON ri.item_id = i.id
      JOIN requisitions r ON ri.requisition_id = r.id
      WHERE r.facility_id = ? AND DATE(r.created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY i.id, i.item_name, i.category
      ORDER BY total_requested DESC
      LIMIT 5
    `, [facilityId]);

    // Get recent deliveries
    const [recentDeliveries] = await pool.execute(`
      SELECT d.id, d.delivered_at, d.tracking_number,
             (SELECT COUNT(*) FROM requisition_items ri JOIN requisitions r ON ri.requisition_id = r.id WHERE r.id = d.requisition_id) as item_count
      FROM dispatches d
      WHERE d.facility_id = ? AND d.status = 'delivered'
      ORDER BY d.delivered_at DESC
      LIMIT 5
    `, [facilityId]);

    res.json({
      success: true,
      data: {
        stats: stats[0],
        pending_requests: pendingRequests,
        low_stock_items: lowStockItems,
        top_requested_items: topRequestedItems,
        recent_deliveries: recentDeliveries
      }
    });
  } catch (error) {
    console.error('Facility admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data',
      error: error.message
    });
  }
};

// Facility User Dashboard
const getFacilityUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const facilityId = req.user.facility_id;

    // Get user statistics
    const [stats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM requisitions WHERE user_id = ?) as my_total_requests,
        (SELECT COUNT(*) FROM requisitions WHERE user_id = ? AND status = 'pending') as my_pending_requests,
        (SELECT COUNT(*) FROM requisitions WHERE user_id = ? AND status = 'delivered') as my_delivered_requests,
        (SELECT COUNT(*) FROM requisitions WHERE user_id = ? AND DATE(created_at) = CURDATE()) as my_today_requests,
        (SELECT COUNT(*) FROM inventory WHERE facility_id = ?) as available_items
    `, [userId, userId, userId, userId, facilityId]);

    // Get my recent requisitions
    const [myRequisitions] = await pool.execute(`
      SELECT r.id, r.status, r.priority, r.created_at, r.delivered_at,
             (SELECT COUNT(*) FROM requisition_items WHERE requisition_id = r.id) as item_count,
             (SELECT SUM(quantity) FROM requisition_items WHERE requisition_id = r.id) as total_quantity,
             CASE 
               WHEN r.status = 'delivered' THEN DATEDIFF(r.delivered_at, r.created_at)
               ELSE DATEDIFF(NOW(), r.created_at)
             END as processing_days
      FROM requisitions r
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [userId]);

    // Get available inventory items (for reference)
    const [availableItems] = await pool.execute(`
      SELECT item_code, item_name, category, quantity, unit,
             CASE WHEN quantity > 0 THEN 'Available' ELSE 'Out of Stock' END as availability
      FROM inventory
      WHERE facility_id = ? AND quantity > 0
      ORDER BY item_name
      LIMIT 20
    `, [facilityId]);

    // Get my request statistics by status
    const [statusStats] = await pool.execute(`
      SELECT 
        status,
        COUNT(*) as count,
        AVG(CASE 
          WHEN status = 'delivered' THEN DATEDIFF(delivered_at, created_at)
          ELSE DATEDIFF(NOW(), created_at)
        END) as avg_processing_days
      FROM requisitions
      WHERE user_id = ? AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
      GROUP BY status
      ORDER BY count DESC
    `, [userId]);

    // Get notifications/alerts
    const [notifications] = await pool.execute(`
      SELECT 
        'requisition' as type,
        CONCAT('Your requisition #', r.id, ' status changed to ', r.status) as message,
        r.updated_at as created_at,
        r.status as status
      FROM requisitions r
      WHERE r.user_id = ? AND r.updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY r.updated_at DESC
      LIMIT 5
    `, [userId]);

    res.json({
      success: true,
      data: {
        stats: stats[0],
        my_requisitions: myRequisitions,
        available_items: availableItems,
        status_stats: statusStats,
        notifications: notifications
      }
    });
  } catch (error) {
    console.error('Facility user dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data',
      error: error.message
    });
  }
};

module.exports = {
  getSuperAdminDashboard,
  getWarehouseAdminDashboard,
  getFacilityAdminDashboard,
  getFacilityUserDashboard
};