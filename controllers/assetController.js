const { pool, cloudinary } = require('../config');

// Get assets
const getAssets = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      facility_id, 
      status = 'active',
      assigned_to,
      search 
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = ['1=1'];
    let queryParams = [];

    // Role-based access control
    if (req.user.role === 'facility_admin' || req.user.role === 'facility_user') {
      whereConditions.push('a.facility_id = ?');
      queryParams.push(req.user.facility_id);
    } else if (req.user.role === 'warehouse_admin') {
      whereConditions.push('a.facility_id IS NULL'); // Warehouse assets
    }

    // Apply filters
    if (type) {
      whereConditions.push('a.type = ?');
      queryParams.push(type);
    }

    if (facility_id && req.user.role === 'super_admin') {
      whereConditions.push('a.facility_id = ?');
      queryParams.push(facility_id);
    }

    if (status) {
      whereConditions.push('a.status = ?');
      queryParams.push(status);
    }

    if (assigned_to) {
      whereConditions.push('a.assigned_to = ?');
      queryParams.push(assigned_to);
    }

    if (search) {
      whereConditions.push('(a.name LIKE ? OR a.serial_number LIKE ? OR a.model LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM assets a WHERE ${whereClause}`,
      queryParams
    );

    // Get assets
    const [assets] = await pool.execute(
      `SELECT a.*, 
              f.name as facility_name, f.location as facility_location,
              u.name as assigned_to_name, u.email as assigned_to_email
       FROM assets a
       LEFT JOIN facilities f ON a.facility_id = f.id
       LEFT JOIN users u ON a.assigned_to = u.id
       WHERE ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), parseInt(offset)]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        assets,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get assets',
      error: error.message
    });
  }
};

// Get asset by ID
const getAssetById = async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT a.*, 
             f.name as facility_name, f.location as facility_location,
             u.name as assigned_to_name, u.email as assigned_to_email, u.phone as assigned_to_phone
      FROM assets a
      LEFT JOIN facilities f ON a.facility_id = f.id
      LEFT JOIN users u ON a.assigned_to = u.id
      WHERE a.id = ?
    `;

    const queryParams = [id];

    // Role-based access control
    if (req.user.role === 'facility_admin' || req.user.role === 'facility_user') {
      query += ' AND a.facility_id = ?';
      queryParams.push(req.user.facility_id);
    } else if (req.user.role === 'warehouse_admin') {
      query += ' AND a.facility_id IS NULL';
    }

    const [assets] = await pool.execute(query, queryParams);

    if (assets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found or access denied'
      });
    }

    res.json({
      success: true,
      data: assets[0]
    });
  } catch (error) {
    console.error('Get asset by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get asset',
      error: error.message
    });
  }
};

// Create asset
const createAsset = async (req, res) => {
  try {
    const { 
      name, 
      type, 
      serial_number, 
      model, 
      manufacturer, 
      purchase_date, 
      warranty_expiry, 
      assigned_to, 
      facility_id, 
      department 
    } = req.body;

    // Determine facility_id based on user role
    let targetFacilityId = facility_id;
    if (req.user.role === 'facility_admin') {
      targetFacilityId = req.user.facility_id;
    } else if (req.user.role === 'warehouse_admin') {
      targetFacilityId = null; // Warehouse assets
    }

    // Check if serial number already exists
    if (serial_number) {
      const [existingAssets] = await pool.execute(
        'SELECT id FROM assets WHERE serial_number = ?',
        [serial_number]
      );

      if (existingAssets.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Asset with this serial number already exists'
        });
      }
    }

    // Insert asset
    const [result] = await pool.execute(
      `INSERT INTO assets (name, type, serial_number, model, manufacturer, purchase_date, warranty_expiry, assigned_to, facility_id, department, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())`,
      [name, type, serial_number || null, model || null, manufacturer || null, purchase_date || null, warranty_expiry || null, assigned_to || null, targetFacilityId, department || null]
    );

    // Get created asset
    const [assets] = await pool.execute(
      `SELECT a.*, 
              f.name as facility_name, u.name as assigned_to_name
       FROM assets a
       LEFT JOIN facilities f ON a.facility_id = f.id
       LEFT JOIN users u ON a.assigned_to = u.id
       WHERE a.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: assets[0]
    });
  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create asset',
      error: error.message
    });
  }
};

// Update asset
const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      type, 
      serial_number, 
      model, 
      manufacturer, 
      purchase_date, 
      warranty_expiry, 
      assigned_to, 
      department, 
      status 
    } = req.body;

    // Check access permissions
    let query = 'SELECT facility_id FROM assets WHERE id = ?';
    const queryParams = [id];

    if (req.user.role === 'facility_admin') {
      query += ' AND facility_id = ?';
      queryParams.push(req.user.facility_id);
    } else if (req.user.role === 'warehouse_admin') {
      query += ' AND facility_id IS NULL';
    }

    const [assets] = await pool.execute(query, queryParams);

    if (assets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found or access denied'
      });
    }

    // Check if serial number already exists (excluding current asset)
    if (serial_number) {
      const [existingAssets] = await pool.execute(
        'SELECT id FROM assets WHERE serial_number = ? AND id != ?',
        [serial_number, id]
      );

      if (existingAssets.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Asset with this serial number already exists'
        });
      }
    }

    // Update asset
    await pool.execute(
      `UPDATE assets 
       SET name = ?, type = ?, serial_number = ?, model = ?, manufacturer = ?, purchase_date = ?, warranty_expiry = ?, assigned_to = ?, department = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, type, serial_number, model, manufacturer, purchase_date, warranty_expiry, assigned_to, department, status, id]
    );

    // Get updated asset
    const [updatedAssets] = await pool.execute(
      `SELECT a.*, 
              f.name as facility_name, u.name as assigned_to_name
       FROM assets a
       LEFT JOIN facilities f ON a.facility_id = f.id
       LEFT JOIN users u ON a.assigned_to = u.id
       WHERE a.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Asset updated successfully',
      data: updatedAssets[0]
    });
  } catch (error) {
    console.error('Update asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update asset',
      error: error.message
    });
  }
};

// Upload asset image
const uploadAssetImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Check if asset exists and user has access
    let query = 'SELECT facility_id FROM assets WHERE id = ?';
    const queryParams = [id];

    if (req.user.role === 'facility_admin') {
      query += ' AND facility_id = ?';
      queryParams.push(req.user.facility_id);
    } else if (req.user.role === 'warehouse_admin') {
      query += ' AND facility_id IS NULL';
    }

    const [assets] = await pool.execute(query, queryParams);

    if (assets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found or access denied'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'hospital-inventory/assets',
          public_id: `asset-${id}-${Date.now()}`,
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Update asset with image URL
    await pool.execute(
      'UPDATE assets SET image_url = ?, updated_at = NOW() WHERE id = ?',
      [uploadResult.secure_url, id]
    );

    res.json({
      success: true,
      message: 'Asset image uploaded successfully',
      data: {
        image_url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      }
    });
  } catch (error) {
    console.error('Upload asset image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload asset image',
      error: error.message
    });
  }
};

// Delete asset
const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;

    // Only super admin and warehouse admin can delete assets
    if (req.user.role !== 'super_admin' && req.user.role !== 'warehouse_admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to delete assets'
      });
    }

    // Get asset details for image cleanup
    const [assets] = await pool.execute(
      'SELECT image_url FROM assets WHERE id = ?',
      [id]
    );

    if (assets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Delete from Cloudinary if image exists
    if (assets[0].image_url) {
      try {
        const publicId = assets[0].image_url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`hospital-inventory/assets/${publicId}`);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete asset
    const [result] = await pool.execute(
      'DELETE FROM assets WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    res.json({
      success: true,
      message: 'Asset deleted successfully'
    });
  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete asset',
      error: error.message
    });
  }
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  uploadAssetImage,
  deleteAsset
};