import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaCamera, FaPaperclip, FaClock, FaBox, FaTruck, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle, FaEye } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const AcknowledgementOfReceipts = () => {
  // State for dispatched items
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  
  // Simulate fetching data
  useEffect(() => {
    // In a real app, this would come from an API
    const mockData = [
      {
        id: 'RCPT-001',
        itemName: 'Paracetamol 500mg',
        batch: 'B789',
        lot: 'L456',
        expiryDate: '2024-06-15',
        quantity: 100,
        dispatchDate: '2023-10-25',
        status: 'Confirmed',
        warehouse: 'Main Warehouse',
        condition: 'Good',
        receiptDate: '2023-10-26',
        notes: 'All items received in good condition',
        attachment: 'photo1.jpg'
      },
      {
        id: 'RCPT-002',
        itemName: 'Amoxicillin 500mg',
        batch: 'B234',
        lot: 'L789',
        expiryDate: '2024-05-20',
        quantity: 150,
        dispatchDate: '2023-10-24',
        status: 'Confirmed',
        warehouse: 'Main Warehouse',
        condition: 'Partially Damaged',
        receiptDate: '2023-10-25',
        notes: '2 boxes damaged during transit',
        attachment: 'damage_report.pdf'
      },
      {
        id: 'RCPT-003',
        itemName: 'Surgical Gloves',
        batch: 'B567',
        lot: 'L123',
        expiryDate: '2025-01-10',
        quantity: 200,
        dispatchDate: '2023-10-23',
        status: 'Pending',
        warehouse: 'Main Warehouse',
        condition: '',
        receiptDate: '',
        notes: '',
        attachment: null
      }
    ];
    
    // Simulate API delay
    setTimeout(() => {
      setReceipts(mockData);
      setLoading(false);
    }, 800);
  }, []);

  // Handle view detail
  const handleViewDetail = (receipt) => {
    setSelectedReceipt(receipt);
    setShowDetailModal(true);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Confirmed':
        return 'bg-success';
      case 'Pending':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      {/* Header Section - Responsive */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h2 className="mb-1">Acknowledgement of Receipts</h2>
          <p className="text-muted mb-0">Confirm receipt of items dispatched from warehouse</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="text-end me-3">
            <div className="text-muted small">Department: Pharmacy</div>
            <div>User: Dr. Sharma</div>
          </div>
          <div className="bg-light rounded-circle p-2 flex-shrink-0">
            <FaTruck size={24} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Main Card - Responsive */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading receipts...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Receipt ID</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((receipt) => (
                    <tr key={receipt.id}>
                      <td>{receipt.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <FaBox className="text-muted" />
                          </div>
                          <div>
                            <div>{receipt.itemName}</div>
                            <small className="text-muted">Batch: {receipt.batch} | Lot: {receipt.lot}</small>
                          </div>
                        </div>
                      </td>
                      <td>{receipt.quantity} units</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(receipt.status)}`}>
                          {receipt.status}
                        </span>
                      </td>
                      <td>{formatDate(receipt.receiptDate || receipt.dispatchDate)}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewDetail(receipt)}
                        >
                          <FaEye /> <span className="d-none d-md-inline-block ms-1">View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Receipt Detail Modal */}
      <div className={`modal fade ${showDetailModal ? 'show' : ''}`} style={{ display: showDetailModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Receipt Details</h5>
              <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
            </div>
            <div className="modal-body">
              {selectedReceipt && (
                <div className="row">
                  <div className="col-12 mb-3">
                    <h4 className="mb-0">{selectedReceipt.itemName}</h4>
                    <div className="text-muted small">
                      Receipt ID: {selectedReceipt.id}
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <strong>Batch/Lot:</strong>
                    <div>Batch: {selectedReceipt.batch}</div>
                    <div>Lot: {selectedReceipt.lot}</div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <strong>Expiry Date:</strong>
                    <div>{formatDate(selectedReceipt.expiryDate)}</div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <strong>Quantity:</strong>
                    <div>{selectedReceipt.quantity} units</div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <strong>Status:</strong>
                    <div>
                      <span className={`badge ${getStatusBadgeClass(selectedReceipt.status)}`}>
                        {selectedReceipt.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <strong>Dispatch Date:</strong>
                    <div>{formatDate(selectedReceipt.dispatchDate)}</div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <strong>Receipt Date:</strong>
                    <div>{formatDate(selectedReceipt.receiptDate)}</div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <strong>Warehouse:</strong>
                    <div>{selectedReceipt.warehouse}</div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <strong>Condition:</strong>
                    <div>{selectedReceipt.condition || '-'}</div>
                  </div>
                  
                  <div className="col-12 mb-3">
                    <strong>Notes:</strong>
                    <div>{selectedReceipt.notes || '-'}</div>
                  </div>
                  
                  {selectedReceipt.attachment && (
                    <div className="col-12 mb-3">
                      <strong>Attachment:</strong>
                      <div>
                        <span className="badge bg-success">
                          <FaCheckCircle className="me-1" /> {selectedReceipt.attachment}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {showDetailModal && <div className="modal-backdrop fade show"></div>}

      {/* Information Section - Responsive */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title mb-3">About Receipt Acknowledgement</h5>
          <div className="row g-4">
            {/* Confirmation Process Card */}
            <div className="col-12 col-md-6">
              <div className="card h-100 border-0" style={{ backgroundColor: '#e1f5fe' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 flex-shrink-0">
                      <FaEye size={24} className="text-primary" />
                    </div>
                    <h5 className="card-title mb-0">View Receipt Details</h5>
                  </div>
                  <p className="card-text">
                    Click the "View" button to see complete details of your receipt including item information, condition, notes, and any attached documents or photos.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Important Notes Card */}
            <div className="col-12 col-md-6">
              <div className="card h-100 border-0" style={{ backgroundColor: '#fff8e1' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3 flex-shrink-0">
                      <FaExclamationTriangle size={24} className="text-warning" />
                    </div>
                    <h5 className="card-title mb-0">Important Notes</h5>
                  </div>
                  <p className="card-text">
                    Receipt details provide a complete record of your acknowledged items. This includes dispatch information, receipt confirmation, condition reports, and any supporting documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcknowledgementOfReceipts;