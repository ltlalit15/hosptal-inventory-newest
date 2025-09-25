import React, { useState } from 'react';
import { FaEdit, FaPlusCircle, FaArrowDown, FaArrowUp, FaHistory } from 'react-icons/fa';

const WarehouseInventory = () => {
  // Sample inventory data (updated to include lastIn and lastOut)
  const initialInventoryItems = [
    {
      id: 'DRG-0421',
      name: 'Paracetamol 500mg',
      category: 'Pharmaceutical',
      stock: 8,
      unit: 'Tablets',
      minLevel: 20,
      standardCost: 2.50,
      movingAvgCost: 2.60,
      lastPOCost: 2.45,
      batchNo: 'B2023-087',
      expiryDate: '2025-12-01',
      abcClass: 'A',
      facilityTransferPrice: 3.00,
      batches: [
        { batchNo: 'B2023-087', expiry: '2025-12-01', quantity: 8, cost: 2.50 },
        { batchNo: 'B2023-045', expiry: '2025-08-15', quantity: 0, cost: 2.40 },
      ],
      lastIn: '2023-10-15',
      lastOut: '2023-10-10',
      movementHistory: [
        { date: '2023-10-15', type: 'IN', quantity: 10, source: 'Supplier', notes: 'Regular supply' },
        { date: '2023-10-10', type: 'OUT', quantity: 5, destination: 'Facility A', notes: 'Regular demand' },
        { date: '2023-10-05', type: 'OUT', quantity: 7, destination: 'Facility B', notes: 'Emergency request' },
        { date: '2023-10-01', type: 'IN', quantity: 20, source: 'Supplier', notes: 'Monthly stock' },
      ]
    },
    {
      id: 'MS-0876',
      name: 'Surgical Gloves (Large)',
      category: 'Medical Supply',
      stock: 0,
      unit: 'Pairs',
      minLevel: 50,
      standardCost: 1.20,
      movingAvgCost: 1.25,
      lastPOCost: 1.18,
      batchNo: 'B2023-102',
      expiryDate: '2026-03-22',
      abcClass: 'B',
      facilityTransferPrice: 1.50,
      batches: [
        { batchNo: 'B2023-102', expiry: '2026-03-22', quantity: 0, cost: 1.20 },
      ],
      lastIn: '2023-09-20',
      lastOut: '2023-10-05',
      movementHistory: [
        { date: '2023-09-20', type: 'IN', quantity: 100, source: 'Supplier', notes: 'Monthly supply' },
        { date: '2023-10-05', type: 'OUT', quantity: 100, destination: 'Facility C', notes: 'Regular demand' },
      ]
    },
    {
      id: 'CON-1543',
      name: 'Syringe 5ml',
      category: 'Consumable',
      stock: 142,
      unit: 'Pieces',
      minLevel: 30,
      standardCost: 0.80,
      movingAvgCost: 0.82,
      lastPOCost: 0.79,
      batchNo: 'B2023-066',
      expiryDate: '2025-10-30',
      abcClass: 'C',
      facilityTransferPrice: 1.00,
      batches: [
        { batchNo: 'B2023-066', expiry: '2025-10-30', quantity: 100, cost: 0.80 },
        { batchNo: 'B2023-021', expiry: '2025-07-12', quantity: 42, cost: 0.78 },
      ],
      lastIn: '2023-10-12',
      lastOut: '2023-10-08',
      movementHistory: [
        { date: '2023-10-12', type: 'IN', quantity: 50, source: 'Supplier', notes: 'Weekly supply' },
        { date: '2023-10-08', type: 'OUT', quantity: 30, destination: 'Facility A', notes: 'Regular demand' },
        { date: '2023-10-01', type: 'IN', quantity: 100, source: 'Supplier', notes: 'Monthly stock' },
      ]
    },
    {
      id: 'DRG-2087',
      name: 'Amoxicillin 250mg',
      category: 'Pharmaceutical',
      stock: 45,
      unit: 'Capsules',
      minLevel: 25,
      standardCost: 4.00,
      movingAvgCost: 4.10,
      lastPOCost: 3.95,
      batchNo: 'B2023-118',
      expiryDate: '2025-11-05',
      abcClass: 'A',
      facilityTransferPrice: 4.50,
      batches: [
        { batchNo: 'B2023-118', expiry: '2025-11-05', quantity: 45, cost: 4.00 },
      ],
      lastIn: '2023-10-01',
      lastOut: '2023-09-28',
      movementHistory: [
        { date: '2023-10-01', type: 'IN', quantity: 50, source: 'Supplier', notes: 'Monthly supply' },
        { date: '2023-09-28', type: 'OUT', quantity: 15, destination: 'Facility B', notes: 'Regular demand' },
      ]
    },
  ];

  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStockInModal, setShowStockInModal] = useState(false);
  const [showStockOutModal, setShowStockOutModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Pharmaceutical',
    stock: 0,
    unit: '',
    minLevel: 0,
    standardCost: 0,
    movingAvgCost: 0,
    lastPOCost: 0,
    batchNo: '',
    expiryDate: '',
    abcClass: 'A',
    facilityTransferPrice: 0,
    batches: [],
    lastIn: '',
    lastOut: ''
  });

  const [stockFormData, setStockFormData] = useState({
    quantity: 0,
    source: '',
    destination: '',
    notes: '',
    batchNo: '',
    expiryDate: ''
  });

  // Calculate status
  const calculateStatus = (item) => {
    if (item.stock === 0) return 'out';
    if (item.stock < item.minLevel) return 'low';
    return 'in';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'low':
        return <span className="badge bg-warning text-dark rounded-pill px-3 py-2">Low Stock</span>;
      case 'out':
        return <span className="badge bg-danger rounded-pill px-3 py-2">Out of Stock</span>;
      case 'in':
        return <span className="badge bg-success rounded-pill px-3 py-2">In Stock</span>;
      default:
        return <span className="badge bg-secondary rounded-pill px-3 py-2">Unknown</span>;
    }
  };

  const getRowClass = (status) => {
    switch (status) {
      case 'low':
        return 'table-warning';
      case 'out':
        return 'table-danger';
      default:
        return '';
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setFormData({
      id: '',
      name: '',
      category: 'Pharmaceutical',
      stock: 0,
      unit: '',
      minLevel: 0,
      standardCost: 0,
      movingAvgCost: 0,
      lastPOCost: 0,
      batchNo: '',
      expiryDate: '',
      abcClass: 'A',
      facilityTransferPrice: 0,
      batches: [],
      lastIn: '',
      lastOut: '',
      movementHistory: []
    });
    setShowAddModal(true);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      id: item.id,
      name: item.name,
      category: item.category,
      stock: item.stock,
      unit: item.unit,
      minLevel: item.minLevel,
      standardCost: item.standardCost,
      movingAvgCost: item.movingAvgCost,
      lastPOCost: item.lastPOCost,
      batchNo: item.batchNo,
      expiryDate: item.expiryDate,
      abcClass: item.abcClass,
      facilityTransferPrice: item.facilityTransferPrice,
      batches: item.batches,
      lastIn: item.lastIn,
      lastOut: item.lastOut,
      movementHistory: item.movementHistory || []
    });
    setShowEditModal(true);
  };

  const openStockInModal = (item) => {
    setCurrentItem(item);
    setStockFormData({
      quantity: 0,
      source: 'Supplier',
      notes: '',
      batchNo: '',
      expiryDate: ''
    });
    setShowStockInModal(true);
  };

  const openStockOutModal = (item) => {
    setCurrentItem(item);
    setStockFormData({
      quantity: 0,
      destination: '',
      notes: ''
    });
    setShowStockOutModal(true);
  };

  const openHistoryModal = (item) => {
    setCurrentItem(item);
    setShowHistoryModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['stock', 'minLevel', 'standardCost', 'movingAvgCost', 'lastPOCost', 'facilityTransferPrice'].includes(name)
        ? parseFloat(value) || 0
        : value,
    });
  };

  const handleStockInputChange = (e) => {
    const { name, value } = e.target;
    setStockFormData({
      ...stockFormData,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    });
  };

  const handleAddItem = () => {
    if (!formData.id || !formData.name || !formData.unit) {
      alert('Please fill required fields: ID, Name, Unit.');
      return;
    }
    setInventoryItems([...inventoryItems, { ...formData }]);
    setShowAddModal(false);
  };

  const handleEditItem = () => {
    setInventoryItems(
      inventoryItems.map((item) =>
        item.id === currentItem.id ? { ...formData } : item
      )
    );
    setShowEditModal(false);
  };

  const handleStockIn = () => {
    const quantity = stockFormData.quantity || 0;
    if (quantity <= 0) {
      alert('Enter valid quantity.');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const newMovement = {
      date: today,
      type: 'IN',
      quantity: quantity,
      source: stockFormData.source,
      notes: stockFormData.notes
    };
    
    setInventoryItems(
      inventoryItems.map((item) => {
        if (item.id === currentItem.id) {
          // Add new batch if provided
          let updatedBatches = [...item.batches];
          if (stockFormData.batchNo && stockFormData.expiryDate) {
            updatedBatches.push({
              batchNo: stockFormData.batchNo,
              expiry: stockFormData.expiryDate,
              quantity: quantity,
              cost: item.standardCost
            });
          }
          
          return {
            ...item, 
            stock: item.stock + quantity,
            lastIn: today,
            movementHistory: [newMovement, ...(item.movementHistory || [])],
            batches: updatedBatches
          };
        }
        return item;
      })
    );
    setShowStockInModal(false);
  };

  const handleStockOut = () => {
    const quantity = stockFormData.quantity || 0;
    if (quantity <= 0) {
      alert('Enter valid quantity.');
      return;
    }
    
    if (quantity > currentItem.stock) {
      alert('Not enough stock available.');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const newMovement = {
      date: today,
      type: 'OUT',
      quantity: quantity,
      destination: stockFormData.destination,
      notes: stockFormData.notes
    };
    
    setInventoryItems(
      inventoryItems.map((item) => {
        if (item.id === currentItem.id) {
          // Update batches (FIFO - First In First Out)
          let updatedBatches = [...item.batches];
          let remainingQuantity = quantity;
          
          for (let i = 0; i < updatedBatches.length && remainingQuantity > 0; i++) {
            if (updatedBatches[i].quantity > 0) {
              const deductAmount = Math.min(updatedBatches[i].quantity, remainingQuantity);
              updatedBatches[i].quantity -= deductAmount;
              remainingQuantity -= deductAmount;
            }
          }
          
          return {
            ...item, 
            stock: item.stock - quantity,
            lastOut: today,
            movementHistory: [newMovement, ...(item.movementHistory || [])],
            batches: updatedBatches
          };
        }
        return item;
      })
    );
    setShowStockOutModal(false);
  };

  const closeModalOnBackdrop = (e) => {
    if (e.target.classList.contains('modal')) {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowStockInModal(false);
      setShowStockOutModal(false);
      setShowHistoryModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return dateString.split('-').reverse().join('/');
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-0">Inventory Management</h2>
        <button className="btn btn-primary d-flex align-items-center" onClick={openAddModal}>
          <FaPlusCircle className="me-2" /> Add New Item
        </button>
      </div>

      {/* Table Card */}
      <div className="card border-0 ">
        <div className="card-header bg-light">
          <h5 className="mb-0 text-muted">All Inventory Items</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="px-4 py-3">Item Code</th>
                  <th scope="col" className="px-4 py-3">Item Name</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Qty Available</th>
                  <th scope="col" className="px-4 py-3">Reorder Level</th>
                  <th scope="col" className="px-4 py-3">Last In</th>
                  <th scope="col" className="px-4 py-3">Last Out</th>
                  <th scope="col" className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => {
                  const status = calculateStatus(item);
                  return (
                    <tr key={item.id} className={getRowClass(status)}>
                      <td className="px-4 py-3 align-middle">{item.id}</td>
                      <td className="px-4 py-3 align-middle">{item.name}</td>
                      <td className="px-4 py-3 align-middle">{item.category}</td>
                      <td className="px-4 py-3 align-middle fw-bold">{item.stock}</td>
                      <td className="px-4 py-3 align-middle">{item.minLevel}</td>
                      <td className="px-4 py-3 align-middle">{formatDate(item.lastIn)}</td>
                      <td className="px-4 py-3 align-middle">{formatDate(item.lastOut)}</td>
                      <td className="px-4 py-3 align-middle">
                        <div className="d-flex gap-1 flex-wrap">
                          <button
                            className="btn btn-sm btn-success d-flex align-items-center"
                            onClick={() => openStockInModal(item)}
                            title="Stock In"
                          >
                            <FaArrowDown className="me-1" /> In
                          </button>
                          <button
                            className="btn btn-sm btn-warning d-flex align-items-center"
                            onClick={() => openStockOutModal(item)}
                            title="Stock Out"
                          >
                            <FaArrowUp className="me-1" /> Out
                          </button>
                          <button
                            className="btn btn-sm btn-info d-flex align-items-center text-white"
                            onClick={() => openHistoryModal(item)}
                            title="View Movement History"
                          >
                            <FaHistory className="me-1" /> History
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEditModal(item)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========== MODALS ========== */}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={closeModalOnBackdrop}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Add New Inventory Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Item Code <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="e.g. DRG-0421"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Item Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Paracetamol"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select form-select-lg"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Pharmaceutical">Pharmaceutical</option>
                    <option value="Medical Supply">Medical Supply</option>
                    <option value="Consumable">Consumable</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Qty Available</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Unit <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder="e.g. Tablets, Boxes"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Reorder Level</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="minLevel"
                    value={formData.minLevel}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Standard Cost</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="standardCost"
                    value={formData.standardCost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Moving Avg Cost</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="movingAvgCost"
                    value={formData.movingAvgCost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last PO Cost</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="lastPOCost"
                    value={formData.lastPOCost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Batch/Lot No</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="batchNo"
                    value={formData.batchNo}
                    onChange={handleInputChange}
                    placeholder="e.g. B2023-087"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">ABC Class</label>
                  <select
                    className="form-select form-select-lg"
                    name="abcClass"
                    value={formData.abcClass}
                    onChange={handleInputChange}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Facility Transfer Price</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="facilityTransferPrice"
                    value={formData.facilityTransferPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddItem}>
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={closeModalOnBackdrop}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Edit Inventory Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Item Code</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Item Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select form-select-lg"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Pharmaceutical">Pharmaceutical</option>
                    <option value="Medical Supply">Medical Supply</option>
                    <option value="Consumable">Consumable</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Unit</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Reorder Level</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="minLevel"
                    value={formData.minLevel}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Standard Cost</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="standardCost"
                    value={formData.standardCost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Moving Avg Cost</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="movingAvgCost"
                    value={formData.movingAvgCost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last PO Cost</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="lastPOCost"
                    value={formData.lastPOCost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">ABC Class</label>
                  <select
                    className="form-select form-select-lg"
                    name="abcClass"
                    value={formData.abcClass}
                    onChange={handleInputChange}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Facility Transfer Price</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="facilityTransferPrice"
                    value={formData.facilityTransferPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleEditItem}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock In Modal */}
      {showStockInModal && currentItem && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={closeModalOnBackdrop}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Stock In: {currentItem.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowStockInModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Current Stock</label>
                  <div className="form-control form-control-lg bg-light">
                    {currentItem.stock} {currentItem.unit}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Quantity <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="quantity"
                    value={stockFormData.quantity}
                    onChange={handleStockInputChange}
                    min="1"
                    step="1"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Source</label>
                  <select
                    className="form-select form-select-lg"
                    name="source"
                    value={stockFormData.source}
                    onChange={handleStockInputChange}
                  >
                    <option value="Supplier">Supplier</option>
                    <option value="Return">Return</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Batch/Lot No</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="batchNo"
                    value={stockFormData.batchNo}
                    onChange={handleStockInputChange}
                    placeholder="e.g. B2023-087"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="expiryDate"
                    value={stockFormData.expiryDate}
                    onChange={handleStockInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control form-control-lg"
                    name="notes"
                    value={stockFormData.notes}
                    onChange={handleStockInputChange}
                    rows="2"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStockInModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={handleStockIn}>
                  Stock In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Out Modal */}
      {showStockOutModal && currentItem && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={closeModalOnBackdrop}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Stock Out: {currentItem.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowStockOutModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Current Stock</label>
                  <div className="form-control form-control-lg bg-light">
                    {currentItem.stock} {currentItem.unit}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Quantity <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="quantity"
                    value={stockFormData.quantity}
                    onChange={handleStockInputChange}
                    min="1"
                    max={currentItem.stock}
                    step="1"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Destination Facility <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="destination"
                    value={stockFormData.destination}
                    onChange={handleStockInputChange}
                    placeholder="e.g. Facility A"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control form-control-lg"
                    name="notes"
                    value={stockFormData.notes}
                    onChange={handleStockInputChange}
                    rows="2"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStockOutModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-warning" onClick={handleStockOut}>
                  Stock Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movement History Modal */}
      {showHistoryModal && currentItem && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={closeModalOnBackdrop}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Movement History: {currentItem.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowHistoryModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Source/Destination</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItem.movementHistory && currentItem.movementHistory.length > 0 ? (
                        currentItem.movementHistory.map((movement, index) => (
                          <tr key={index}>
                            <td>{formatDate(movement.date)}</td>
                            <td>
                              <span className={`badge ${movement.type === 'IN' ? 'bg-success' : 'bg-warning'}`}>
                                {movement.type}
                              </span>
                            </td>
                            <td>{movement.quantity} {currentItem.unit}</td>
                            <td>{movement.source || movement.destination || '—'}</td>
                            <td>{movement.notes || '—'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">No movement history available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowHistoryModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {(showAddModal || showEditModal || showStockInModal || showStockOutModal || showHistoryModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default WarehouseInventory;