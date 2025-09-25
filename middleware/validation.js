const Joi = require('joi');

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  };
};

// User validation schemas
const userSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('super_admin', 'warehouse_admin', 'facility_admin', 'facility_user').required(),
    facility_id: Joi.number().integer().when('role', {
      is: Joi.string().valid('facility_admin', 'facility_user'),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    phone: Joi.string().optional(),
    department: Joi.string().optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().optional(),
    department: Joi.string().optional(),
    status: Joi.string().valid('active', 'inactive').optional()
  })
};

// Facility validation schemas
const facilitySchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    location: Joi.string().required(),
    type: Joi.string().required(),
    contact_person: Joi.string().optional(),
    phone: Joi.string().optional(),
    email: Joi.string().email().optional(),
    address: Joi.string().optional()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    location: Joi.string().optional(),
    type: Joi.string().optional(),
    contact_person: Joi.string().optional(),
    phone: Joi.string().optional(),
    email: Joi.string().email().optional(),
    address: Joi.string().optional(),
    status: Joi.string().valid('active', 'inactive').optional()
  })
};

// Inventory validation schemas
const inventorySchemas = {
  create: Joi.object({
    item_code: Joi.string().required(),
    item_name: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().optional(),
    unit: Joi.string().required(),
    reorder_level: Joi.number().integer().min(0).optional(),
    facility_id: Joi.number().integer().optional()
  }),

  update: Joi.object({
    item_name: Joi.string().optional(),
    category: Joi.string().optional(),
    description: Joi.string().optional(),
    unit: Joi.string().optional(),
    quantity: Joi.number().integer().min(0).optional(),
    reorder_level: Joi.number().integer().min(0).optional()
  }),

  stock: Joi.object({
    quantity: Joi.number().integer().min(0).required(),
    type: Joi.string().valid('add', 'subtract', 'set').required(),
    remarks: Joi.string().optional()
  })
};

// Requisition validation schemas
const requisitionSchemas = {
  create: Joi.object({
    items: Joi.array().items(
      Joi.object({
        item_id: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
        priority: Joi.string().valid('normal', 'high', 'urgent').default('normal')
      })
    ).min(1).required(),
    remarks: Joi.string().optional(),
    facility_id: Joi.number().integer().optional()
  }),

  update: Joi.object({
    status: Joi.string().valid('pending', 'processing', 'approved', 'rejected', 'dispatched', 'delivered', 'completed').required(),
    remarks: Joi.string().optional(),
    approved_quantity: Joi.number().integer().min(0).optional()
  })
};

// Asset validation schemas
const assetSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    serial_number: Joi.string().optional(),
    model: Joi.string().optional(),
    manufacturer: Joi.string().optional(),
    purchase_date: Joi.date().optional(),
    warranty_expiry: Joi.date().optional(),
    assigned_to: Joi.number().integer().optional(),
    facility_id: Joi.number().integer().optional(),
    department: Joi.string().optional()
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    type: Joi.string().optional(),
    serial_number: Joi.string().optional(),
    model: Joi.string().optional(),
    manufacturer: Joi.string().optional(),
    purchase_date: Joi.date().optional(),
    warranty_expiry: Joi.date().optional(),
    assigned_to: Joi.number().integer().optional(),
    department: Joi.string().optional(),
    status: Joi.string().valid('active', 'maintenance', 'retired').optional()
  })
};

module.exports = {
  validate,
  userSchemas,
  facilitySchemas,
  inventorySchemas,
  requisitionSchemas,
  assetSchemas
};