-- Hospital Inventory Management System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS hospital_inventory;
USE hospital_inventory;

-- Facilities table
CREATE TABLE facilities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  status ENUM('active', 'inactive', 'deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_name (name)
);

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'warehouse_admin', 'facility_admin', 'facility_user') NOT NULL,
  facility_id INT,
  phone VARCHAR(20),
  department VARCHAR(100),
  status ENUM('active', 'inactive', 'deleted') DEFAULT 'active',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_facility (facility_id),
  INDEX idx_status (status)
);

-- Inventory table
CREATE TABLE inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_code VARCHAR(50) NOT NULL,
  item_name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  unit VARCHAR(20) NOT NULL,
  quantity INT DEFAULT 0,
  reorder_level INT DEFAULT 0,
  facility_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
  UNIQUE KEY unique_item_facility (item_code, facility_id),
  INDEX idx_category (category),
  INDEX idx_facility (facility_id),
  INDEX idx_item_code (item_code),
  INDEX idx_low_stock (quantity, reorder_level)
);

-- Stock movements table
CREATE TABLE stock_movements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  inventory_id INT NOT NULL,
  type ENUM('add', 'subtract', 'set') NOT NULL,
  quantity INT NOT NULL,
  previous_quantity INT NOT NULL,
  new_quantity INT NOT NULL,
  remarks TEXT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_inventory (inventory_id),
  INDEX idx_user (user_id),
  INDEX idx_created_at (created_at)
);

-- Requisitions table
CREATE TABLE requisitions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  facility_id INT NOT NULL,
  status ENUM('pending', 'processing', 'approved', 'rejected', 'dispatched', 'delivered', 'completed') DEFAULT 'pending',
  priority ENUM('normal', 'high', 'urgent') DEFAULT 'normal',
  remarks TEXT,
  approved_by INT,
  approved_at TIMESTAMP NULL,
  delivered_by INT,
  delivered_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (delivered_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_facility (facility_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_created_at (created_at)
);

-- Requisition items table
CREATE TABLE requisition_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  requisition_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  approved_quantity INT DEFAULT 0,
  delivered_quantity INT DEFAULT 0,
  priority ENUM('normal', 'high', 'urgent') DEFAULT 'normal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES inventory(id) ON DELETE CASCADE,
  INDEX idx_requisition (requisition_id),
  INDEX idx_item (item_id)
);

-- Dispatches table
CREATE TABLE dispatches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  requisition_id INT NOT NULL,
  facility_id INT NOT NULL,
  status ENUM('in_transit', 'delivered', 'cancelled') DEFAULT 'in_transit',
  tracking_number VARCHAR(100),
  dispatched_by INT NOT NULL,
  received_by INT,
  delivered_at TIMESTAMP NULL,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE CASCADE,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
  FOREIGN KEY (dispatched_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_requisition (requisition_id),
  INDEX idx_facility (facility_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Assets table
CREATE TABLE assets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100) NOT NULL,
  serial_number VARCHAR(100) UNIQUE,
  model VARCHAR(100),
  manufacturer VARCHAR(100),
  purchase_date DATE,
  warranty_expiry DATE,
  assigned_to INT,
  facility_id INT,
  department VARCHAR(100),
  status ENUM('active', 'maintenance', 'retired') DEFAULT 'active',
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
  INDEX idx_type (type),
  INDEX idx_facility (facility_id),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_status (status),
  INDEX idx_serial_number (serial_number)
);

-- Insert sample data

-- Sample facilities
INSERT INTO facilities (name, location, type, contact_person, phone, email) VALUES
('Main Hospital', 'Downtown Medical Center', 'Hospital', 'Dr. John Smith', '+1-555-0101', 'admin@mainhospital.com'),
('North Clinic', 'North District', 'Clinic', 'Dr. Sarah Johnson', '+1-555-0102', 'admin@northclinic.com'),
('Emergency Center', 'City Center', 'Emergency', 'Dr. Mike Wilson', '+1-555-0103', 'admin@emergency.com');

-- Sample super admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('System Administrator', 'admin@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGzBqxflO', 'super_admin');

-- Sample warehouse admin (password: warehouse123)
INSERT INTO users (name, email, password, role) VALUES
('Warehouse Manager', 'warehouse@hospital.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'warehouse_admin');

-- Sample facility admin (password: facility123)
INSERT INTO users (name, email, password, role, facility_id) VALUES
('Hospital Admin', 'hospital.admin@hospital.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'facility_admin', 1);

-- Sample facility user (password: user123)
INSERT INTO users (name, email, password, role, facility_id, department) VALUES
('Dr. Alice Brown', 'alice.brown@hospital.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'facility_user', 1, 'Cardiology');

-- Sample inventory items (warehouse stock)
INSERT INTO inventory (item_code, item_name, category, description, unit, quantity, reorder_level, facility_id) VALUES
('MED001', 'Paracetamol 500mg', 'Medicines', 'Pain relief medication', 'Tablets', 1000, 100, NULL),
('MED002', 'Amoxicillin 250mg', 'Medicines', 'Antibiotic', 'Capsules', 500, 50, NULL),
('SUP001', 'Surgical Gloves', 'Supplies', 'Latex surgical gloves', 'Pairs', 2000, 200, NULL),
('SUP002', 'Syringes 5ml', 'Supplies', 'Disposable syringes', 'Pieces', 1500, 150, NULL),
('EQP001', 'Blood Pressure Monitor', 'Equipment', 'Digital BP monitor', 'Units', 50, 5, NULL);

-- Sample facility inventory
INSERT INTO inventory (item_code, item_name, category, description, unit, quantity, reorder_level, facility_id) VALUES
('MED001', 'Paracetamol 500mg', 'Medicines', 'Pain relief medication', 'Tablets', 100, 20, 1),
('MED002', 'Amoxicillin 250mg', 'Medicines', 'Antibiotic', 'Capsules', 50, 10, 1),
('SUP001', 'Surgical Gloves', 'Supplies', 'Latex surgical gloves', 'Pairs', 200, 50, 1),
('SUP002', 'Syringes 5ml', 'Supplies', 'Disposable syringes', 'Pieces', 150, 30, 1);

-- Sample assets
INSERT INTO assets (name, type, serial_number, model, manufacturer, assigned_to, facility_id, department) VALUES
('X-Ray Machine', 'Medical Equipment', 'XR001', 'XR-2000', 'MedTech Inc', NULL, 1, 'Radiology'),
('Ultrasound Scanner', 'Medical Equipment', 'US001', 'US-Pro', 'ScanCorp', NULL, 1, 'Cardiology'),
('Hospital Bed', 'Furniture', 'BED001', 'ComfortBed', 'BedMaker', NULL, 1, 'General Ward');

-- Create indexes for better performance
CREATE INDEX idx_requisitions_date ON requisitions(created_at);
CREATE INDEX idx_dispatches_date ON dispatches(created_at);
CREATE INDEX idx_stock_movements_date ON stock_movements(created_at);
CREATE INDEX idx_assets_warranty ON assets(warranty_expiry);

-- Create views for common queries

-- Low stock items view
CREATE VIEW low_stock_items AS
SELECT 
  i.*,
  f.name as facility_name,
  (i.reorder_level - i.quantity) as shortage_quantity
FROM inventory i
LEFT JOIN facilities f ON i.facility_id = f.id
WHERE i.quantity <= i.reorder_level;

-- Pending requisitions view
CREATE VIEW pending_requisitions AS
SELECT 
  r.*,
  u.name as user_name,
  f.name as facility_name,
  COUNT(ri.id) as item_count,
  SUM(ri.quantity) as total_quantity
FROM requisitions r
LEFT JOIN users u ON r.user_id = u.id
LEFT JOIN facilities f ON r.facility_id = f.id
LEFT JOIN requisition_items ri ON r.id = ri.requisition_id
WHERE r.status = 'pending'
GROUP BY r.id;

-- Active assets view
CREATE VIEW active_assets AS
SELECT 
  a.*,
  f.name as facility_name,
  u.name as assigned_to_name,
  CASE 
    WHEN a.warranty_expiry IS NOT NULL AND a.warranty_expiry < NOW() THEN 'Expired'
    WHEN a.warranty_expiry IS NOT NULL AND a.warranty_expiry < DATE_ADD(NOW(), INTERVAL 30 DAY) THEN 'Expiring Soon'
    ELSE 'Valid'
  END as warranty_status
FROM assets a
LEFT JOIN facilities f ON a.facility_id = f.id
LEFT JOIN users u ON a.assigned_to = u.id
WHERE a.status = 'active';