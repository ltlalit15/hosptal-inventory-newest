const express = require('express');
const multer = require('multer');
const { validate, assetSchemas } = require('../middleware/validation');
const { authenticateToken, authorize } = require('../middleware/auth');
const {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  uploadAssetImage
} = require('../controllers/assetController');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// All routes require authentication
router.use(authenticateToken);

// Get all assets
router.get('/', getAssets);

// Get asset by ID
router.get('/:id', getAssetById);

// Create asset
router.post('/', authorize('super_admin', 'warehouse_admin', 'facility_admin'), validate(assetSchemas.create), createAsset);

// Update asset
router.put('/:id', authorize('super_admin', 'warehouse_admin', 'facility_admin'), validate(assetSchemas.update), updateAsset);

// Upload asset image
router.post('/:id/image', authorize('super_admin', 'warehouse_admin', 'facility_admin'), upload.single('image'), uploadAssetImage);

// Delete asset
router.delete('/:id', authorize('super_admin', 'warehouse_admin'), deleteAsset);

module.exports = router;