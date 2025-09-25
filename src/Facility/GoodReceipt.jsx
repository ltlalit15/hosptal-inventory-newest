import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Form, Row, Col, Button, Alert } from 'react-bootstrap';

const GoodsReceipt = () => {
  // Simplified receipts data matching requirements
  const [receipts, setReceipts] = useState([
    {
      id: 'GRN-2023-001',
      item: 'Paracetamol 500mg',
      qty: 100,
      fromDispatch: 'Central Warehouse',
      status: 'Pending'
    },
    {
      id: 'GRN-2023-002',
      item: 'Surgical Gloves (L)',
      qty: 200,
      fromDispatch: 'Central Warehouse',
      status: 'Pending'
    },
    {
      id: 'GRN-2023-003',
      item: 'Ibuprofen 400mg',
      qty: 80,
      fromDispatch: 'Regional Warehouse',
      status: 'Verified'
    },
    {
      id: 'GRN-2023-004',
      item: 'Face Masks (N95)',
      qty: 100,
      fromDispatch: 'Central Warehouse',
      status: 'Pending'
    }
  ]);

  // Filter states
  const [filterStatus, setFilterStatus] = useState('All');

  // State management
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Get status class for badge
  const getStatusClass = (status) => {
    switch(status) {
      case 'Verified':
        return 'bg-success';
      case 'Pending':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  };

  // Open receipt detail modal
  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowDetailModal(true);
  };

  // Close receipt detail modal
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedReceipt(null);
  };

  // Handle verify action
  const handleVerifyReceipt = (receiptId) => {
    setReceipts(receipts.map(receipt => 
      receipt.id === receiptId ? { ...receipt, status: 'Verified' } : receipt
    ));
  };

  // Filter receipts based on selected status
  const filteredReceipts = receipts.filter(receipt => {
    return filterStatus === 'All' || receipt.status === filterStatus;
  });

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#ffff', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="mb-0">Good Receipt</h1>
          <p className="text-muted mb-0">Acknowledge dispatched items from warehouse</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Filter by Status</label>
              <select 
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => setFilterStatus('All')}
              >
                <i className="bi bi-funnel me-1"></i> Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">GRN ID</th>
                  <th scope="col">Item</th>
                  <th scope="col">Qty</th>
                  <th scope="col">From Dispatch</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.map((receipt) => (
                  <tr key={receipt.id}>
                    <td className="fw-medium">{receipt.id}</td>
                    <td>{receipt.item}</td>
                    <td>{receipt.qty}</td>
                    <td>{receipt.fromDispatch}</td>
                    <td>
                      <span className={`badge ${getStatusClass(receipt.status)} text-white`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td>
                      {receipt.status === 'Pending' && (
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          onClick={() => handleVerifyReceipt(receipt.id)}
                          title="Verify Receipt"
                        >
                          Verify Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredReceipts.length === 0 && (
            <div className="text-center py-4 text-muted">
              No records found matching the selected filters.
            </div>
          )}
        </div>
      </div>

      {/* Receipt Detail Modal */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Receipt Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReceipt && (
            <div className="row">
              <div className="col-12 mb-3">
                <strong>GRN ID:</strong> <span className="text-muted">{selectedReceipt.id}</span>
              </div>
              <div className="col-12 mb-3">
                <strong>Item:</strong> <span className="text-muted">{selectedReceipt.item}</span>
              </div>
              <div className="col-12 mb-3">
                <strong>Qty:</strong> <span className="text-muted">{selectedReceipt.qty}</span>
              </div>
              <div className="col-12 mb-3">
                <strong>From Dispatch:</strong> <span className="text-muted">{selectedReceipt.fromDispatch}</span>
              </div>
              <div className="col-12 mb-3">
                <strong>Status:</strong> 
                <span className={`badge ${getStatusClass(selectedReceipt.status)} text-white ms-2`}>
                  {selectedReceipt.status}
                </span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GoodsReceipt;