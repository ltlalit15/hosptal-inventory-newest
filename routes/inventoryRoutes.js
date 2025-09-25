const express = require('express');
const { validate, inventorySchemas } = require('../middleware/validation');
const { authenticateToken, authorize } = require('../middleware/auth');
const {
  getInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  updateStock,
  deleteInventoryItem,
  getStockMovements,
  getCategories
} = require('../controllers/inventoryController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get categories
router.get('/categories', getCategories);

// Get all inventory items
router.get('/', getInventory);

// Get inventory item by ID
router.get('/:id', getInventoryById);

// Get stock movements for an item
router.get('/:id/movements', getStockMovements);

// Create inventory item
router.post('/', authorize('super_admin', 'warehouse_admin', 'facility_admin'), validate(inventorySchemas.create), createInventoryItem);

// Update inventory item
router.put('/:id', authorize('super_admin', 'warehouse_admin', 'facility_admin'), validate(inventorySchemas.update), updateInventoryItem);

// Update stock quantity
router.patch('/:id/stock', authorize('super_admin', 'warehouse_admin', 'facility_admin'), validate(inventorySchemas.stock), updateStock);

// Delete inventory item
router.delete('/:id', authorize('super_admin', 'warehouse_admin'), deleteInventoryItem);

module.exports = router;