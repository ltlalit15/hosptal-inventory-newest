import React, { useState } from 'react';
import { FaSearch, FaEdit, FaHistory } from 'react-icons/fa';

const SuperAdminInventory = () => {
  // === STATIC MOCK INVENTORY DATA ===
  const mockInventory = [
    {
      id: 'ITM-1001',
      name: 'Paracetamol 500mg',
      category: 'Pharmaceuticals',
      totalQty: 1200,
      inUse: 300,
      available: 900,
      lastUpdated: '2023-10-24',
      unit: 'tablets',
      minLevel: 200,
      standardCost: 0.50,
      movingAvgCost: 0.52,
      lastPOCost: 0.48,
      batchNo: 'B1001',
      expiryDate: '2025-12-31',
      abcClass: 'A',
      facilityTransferPrice: 0.55
    },
    {
      id: 'ITM-1002',
      name: 'IV Fluids (Normal Saline)',
      category: 'Medical Supplies',
      totalQty: 450,
      inUse: 150,
      available: 300,
      lastUpdated: '2023-10-23',
      unit: 'bags',
      minLevel: 100,
      standardCost: 5.00,
      movingAvgCost: 5.20,
      lastPOCost: 4.90,
      batchNo: 'B1002',
      expiryDate: '2024-10-15',
      abcClass: 'A',
      facilityTransferPrice: 5.50
    },
    {
      id: 'ITM-1003',
      name: 'Surgical Gloves (Medium)',
      category: 'Consumables',
      totalQty: 2000,
      inUse: 800,
      available: 1200,
      lastUpdated: '2023-10-22',
      unit: 'pairs',
      minLevel: 500,
      standardCost: 0.20,
      movingAvgCost: 0.22,
      lastPOCost: 0.18,
      batchNo: 'B1003',
      expiryDate: '2026-06-30',
      abcClass: 'B',
      facilityTransferPrice: 0.25
    },
    {
      id: 'ITM-1004',
      name: 'Digital Thermometer',
      category: 'Equipment',
      totalQty: 85,
      inUse: 40,
      available: 45,
      lastUpdated: '2023-10-20',
      unit: 'pieces',
      minLevel: 20,
      standardCost: 15.00,
      movingAvgCost: 15.50,
      lastPOCost: 14.75,
      batchNo: 'B1004',
      expiryDate: null,
      abcClass: 'C',
      facilityTransferPrice: 16.00
    },
    {
      id: 'ITM-1005',
      name: 'Face Masks (Surgical)',
      category: 'Consumables',
      totalQty: 5000,
      inUse: 1200,
      available: 3800,
      lastUpdated: '2023-10-24',
      unit: 'pieces',
      minLevel: 1000,
      standardCost: 0.15,
      movingAvgCost: 0.16,
      lastPOCost: 0.14,
      batchNo: 'B1005',
      expiryDate: '2025-03-31',
      abcClass: 'B',
      facilityTransferPrice: 0.20
    },
    {
      id: 'ITM-1006',
      name: 'Malaria Test Kits',
      category: 'Diagnostics',
      totalQty: 600,
      inUse: 200,
      available: 400,
      lastUpdated: '2023-10-21',
      unit: 'kits',
      minLevel: 150,
      standardCost: 2.50,
      movingAvgCost: 2.60,
      lastPOCost: 2.40,
      batchNo: 'B1006',
      expiryDate: '2024-12-15',
      abcClass: 'A',
      facilityTransferPrice: 2.75
    }
  ];

  // === STATE ===
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);

  // === FILTER LOGIC ===
  const filteredInventory = mockInventory.filter(item => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      item.id.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // === MODAL HANDLERS ===
  // View Modal Handler
  const openViewModal = (item) => {
    setViewItem(item);
    setShowViewModal(true);
  };
  
  const openEditModal = (item) => {
    setCurrentItem(item);
    setShowEditModal(true);
  };

  const openHistoryModal = (item) => {
    setCurrentItem(item);
    setShowHistoryModal(true);
  };

  const closeModalOnBackdrop = (e) => {
    if (e.target === e.currentTarget) {
      setShowViewModal(false);
    }
  };

  // === ACTION HANDLERS (UI-only) ===
  const handleSaveEdit = () => {
    alert(`Item ${currentItem.id} updated (UI demo)`);
    setShowEditModal(false);
  };

  // === HELPER FUNCTIONS ===
  const calculateStatus = (item) => {
    if (item.available === 0) return 'out_of_stock';
    if (item.available < item.minLevel) return 'low_stock';
    return 'in_stock';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'out_of_stock':
        return <span className="badge bg-danger">Out of Stock</span>;
      case 'low_stock':
        return <span className="badge bg-warning text-dark">Low Stock</span>;
      default:
        return <span className="badge bg-success">In Stock</span>;
    }
  };

  return (
    <div className="container-fluid py-3">
      {/* ===== Top Toolbar ===== */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h2 className="fw-bold mb-0">Inventory (Global View)</h2>
        <div className="ms-auto" style={{ maxWidth: '320px', width: '100%' }}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              style={{ height: "40px" }}
              placeholder="Search by Item Code, Name, or Category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" style={{ height: "40px" }} type="button">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Total Qty</th>
                <th>In Use</th>
                <th>Available</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">No inventory items found.</td>
                </tr>
              ) : (
                filteredInventory.map((item, i) => (
                  <tr key={i}>
                    <td className="fw-bold">{item.id}</td>
                    <td>{item.name}</td>
                    <td><span className="badge bg-light text-dark">{item.category}</span></td>
                    <td>{item.totalQty.toLocaleString()}</td>
                    <td className="text-warning fw-medium">{item.inUse.toLocaleString()}</td>
                    <td className="text-success fw-medium">{item.available.toLocaleString()}</td>
                    <td>{new Date(item.lastUpdated).toLocaleDateString()}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          title="Edit Item"
                          onClick={() => openEditModal(item)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-info"
                          title="View Movement History"
                          onClick={() => openHistoryModal(item)}
                        >
                          <FaHistory />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          title="View Details"
                          onClick={() => openViewModal(item)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && currentItem && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Inventory Item: {currentItem.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Item Name</label>
                      <input className="form-control" defaultValue={currentItem.name} readOnly />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <input className="form-control" defaultValue={currentItem.category} readOnly />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Total Quantity</label>
                      <input type="number" className="form-control" defaultValue={currentItem.totalQty} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">In Use</label>
                      <input type="number" className="form-control" defaultValue={currentItem.inUse} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Available</label>
                      <input type="number" className="form-control" defaultValue={currentItem.available} readOnly />
                    </div>
                  </div>
                </form>
                <div className="alert alert-info mt-3">
                  <strong>Note:</strong> In a real system, "Available" = Total Qty - In Use. This is a UI demo.
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveEdit}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MOVEMENT HISTORY MODAL ===== */}
      {showHistoryModal && currentItem && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Movement History: {currentItem.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowHistoryModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted">Recent stock movements for <strong>{currentItem.id}</strong></p>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>From / To</th>
                        <th>Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2023-10-24</td>
                        <td><span className="badge bg-success">Stock In</span></td>
                        <td>+200</td>
                        <td>Central Warehouse</td>
                        <td>PO-8891</td>
                      </tr>
                      <tr>
                        <td>2023-10-22</td>
                        <td><span className="badge bg-warning text-dark">Dispatch</span></td>
                        <td>-50</td>
                        <td>Kumasi Hospital</td>
                        <td>DISP-042</td>
                      </tr>
                      <tr>
                        <td>2023-10-20</td>
                        <td><span className="badge bg-danger">Adjustment</span></td>
                        <td>-10</td>
                        <td>Expired Items</td>
                        <td>ADJ-015</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="alert alert-info">
                  This is simulated data. In production, this would come from the stock movement log.
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowHistoryModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Item Modal */}
      {showViewModal && viewItem && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={closeModalOnBackdrop}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Item Details: {viewItem.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-6 fw-bold">Item ID:</div>
                  <div className="col-6">{viewItem.id}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 fw-bold">Name:</div>
                  <div className="col-6">{viewItem.name}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 fw-bold">Category:</div>
                  <div className="col-6">{viewItem.category}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 fw-bold">Stock:</div>
                  <div className="col-6">{viewItem.available} {viewItem.unit}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 fw-bold">Unit:</div>
                  <div className="col-6">{viewItem.unit}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 fw-bold">Min Level:</div>
                  <div className="col-6">{viewItem.minLevel}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 fw-bold">Standard Cost:</div>
                  <div className="col-6">₵{viewItem.standardCost?.toFixed(2)}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 fw-bold">Moving Avg Cost:</div>
                  <div className="col-6">₵{viewItem.movingAvgCost?.toFixed(2)}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 fw-bold">Last PO Cost:</div>
                  <div className="col-6">₵{viewItem.lastPOCost?.toFixed(2)}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 fw-bold">Batch/Lot No:</div>
                  <div className="col-6">{viewItem.batchNo || '—'}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 fw-bold">Expiry Date:</div>
                  <div className="col-6">{viewItem.expiryDate ? viewItem.expiryDate.split('-').reverse().join('/') : '—'}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 fw-bold">ABC Class:</div>
                  <div className="col-6">
                    <span className={`badge bg-${viewItem.abcClass === 'A' ? 'success' : viewItem.abcClass === 'B' ? 'warning' : 'info'} text-dark`}>
                      {viewItem.abcClass}
                    </span>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 fw-bold">Transfer Price:</div>
                  <div className="col-6">₵{viewItem.facilityTransferPrice?.toFixed(2)}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-6 fw-bold">Status:</div>
                  <div className="col-6">{getStatusBadge(calculateStatus(viewItem))}</div>
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {(showAddModal || showEditModal || showRestockModal || showBatchModal || showViewModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default SuperAdminInventory;