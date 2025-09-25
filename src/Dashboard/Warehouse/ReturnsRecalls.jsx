import React, { useState } from 'react';
import { FaPlus, FaTrash, FaCheck, FaTimes, FaBox, FaCalendarAlt, FaMapMarkerAlt, FaClipboardList, FaHistory, FaEye, FaEdit } from 'react-icons/fa';

const ReturnsRecalls = () => {
  // State for form inputs
  const [reason, setReason] = useState('');
  const [items, setItems] = useState([{ id: 1, name: '', quantity: '', batchNumber: '' }]);
  const [quarantineLocation, setQuarantineLocation] = useState('');
  const [facility, setFacility] = useState('');
  
  // State for return requests
  const [returnRequests, setReturnRequests] = useState([
    {
      id: 'RET-001',
      facility: 'Main Hospital',
      reason: 'Near expiry',
      items: [
        { name: 'Antibiotics', quantity: '50', batchNumber: 'B12345' }
      ],
      quarantineLocation: 'Warehouse A',
      status: 'Pending Verification',
      date: '2023-05-15',
      auditTrail: [
        { action: 'Return request created', user: 'John Doe', timestamp: '2023-05-15 09:30' },
        { action: 'Items moved to Quarantine Zone', user: 'System', timestamp: '2023-05-15 10:15' }
      ]
    },
    {
      id: 'RET-002',
      facility: 'North Clinic',
      reason: 'Defective',
      items: [
        { name: 'Blood Pressure Monitor', quantity: '5', batchNumber: 'B67890' }
      ],
      quarantineLocation: 'Warehouse B',
      status: 'Verified',
      date: '2023-05-10',
      auditTrail: [
        { action: 'Return request created', user: 'Jane Smith', timestamp: '2023-05-10 14:20' },
        { action: 'Items moved to Quarantine Zone', user: 'System', timestamp: '2023-05-10 15:45' },
        { action: 'QA review completed - Verified', user: 'Dr. James', timestamp: '2023-05-12 11:30' }
      ]
    },
    {
      id: 'RET-003',
      facility: 'South Pharmacy',
      reason: 'Recall',
      items: [
        { name: 'Vitamin C', quantity: '100', batchNumber: 'C54321' }
      ],
      quarantineLocation: 'Warehouse C',
      status: 'Processed',
      date: '2023-05-05',
      auditTrail: [
        { action: 'Return request created', user: 'Mike Johnson', timestamp: '2023-05-05 09:15' },
        { action: 'Items moved to Quarantine Zone', user: 'System', timestamp: '2023-05-05 10:30' },
        { action: 'QA review completed - Verified', user: 'Dr. Sarah', timestamp: '2023-05-07 14:20' },
        { action: 'Return processed', user: 'Warehouse Manager', timestamp: '2023-05-08 11:45' }
      ]
    }
  ]);

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Add new item row
  const addItemRow = () => {
    setItems([...items, { id: items.length + 1, name: '', quantity: '', batchNumber: '' }]);
  };

  // Remove item row
  const removeItemRow = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Handle item input change
  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Submit new return request
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRequest = {
      id: `RET-${String(returnRequests.length + 1).padStart(3, '0')}`,
      facility,
      reason,
      items,
      quarantineLocation,
      status: 'Pending Verification',
      date: new Date().toISOString().split('T')[0],
      auditTrail: [
        { action: 'Return request created', user: 'Current User', timestamp: new Date().toLocaleString() }
      ]
    };
    
    setReturnRequests([newRequest, ...returnRequests]);
    
    // Reset form
    setReason('');
    setItems([{ id: 1, name: '', quantity: '', batchNumber: '' }]);
    setQuarantineLocation('');
    setFacility('');
    setShowCreateModal(false);
    
    alert('Return request created successfully!');
  };

  // Handle verify receipt
  const handleVerifyReceipt = () => {
    if (!currentRequest) return;
    
    const updatedRequests = returnRequests.map(request => {
      if (request.id === currentRequest.id) {
        const newAuditTrail = [
          ...request.auditTrail,
          { 
            action: 'Return verified', 
            user: 'QA Officer', 
            timestamp: new Date().toLocaleString() 
          }
        ];
        
        return {
          ...request,
          status: 'Verified',
          auditTrail: newAuditTrail
        };
      }
      return request;
    });
    
    setReturnRequests(updatedRequests);
    setShowVerifyModal(false);
    alert(`Return ${currentRequest.id} has been verified successfully!`);
  };

  // Handle status update
  const handleStatusUpdate = () => {
    if (!currentRequest || !newStatus) return;
    
    const updatedRequests = returnRequests.map(request => {
      if (request.id === currentRequest.id) {
        const newAuditTrail = [
          ...request.auditTrail,
          { 
            action: `Status updated to ${newStatus}`, 
            user: 'Warehouse Manager', 
            timestamp: new Date().toLocaleString() 
          }
        ];
        
        return {
          ...request,
          status: newStatus,
          auditTrail: newAuditTrail
        };
      }
      return request;
    });
    
    setReturnRequests(updatedRequests);
    setShowStatusModal(false);
    alert(`Status for return ${currentRequest.id} has been updated to ${newStatus}!`);
  };

  // Open create modal
  const openCreateModal = () => {
    // Reset form
    setReason('');
    setItems([{ id: 1, name: '', quantity: '', batchNumber: '' }]);
    setQuarantineLocation('');
    setFacility('');
    setShowCreateModal(true);
  };

  // Open view modal
  const openViewModal = (request) => {
    setCurrentRequest(request);
    setShowViewModal(true);
  };

  // Open status update modal
  const openStatusModal = (request) => {
    setCurrentRequest(request);
    setNewStatus(request.status);
    setShowStatusModal(true);
  };

  // Open verify modal
  const openVerifyModal = (request) => {
    setCurrentRequest(request);
    setShowVerifyModal(true);
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending Verification': return 'bg-warning';
      case 'Verified': return 'bg-info';
      case 'Processed': return 'bg-success';
      case 'Rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0"><FaClipboardList className="me-2" /> Returns & Recalls</h2>
        <button 
          className="btn btn-primary" 
          onClick={openCreateModal}
        >
          <FaPlus className="me-2" /> New Return
        </button>
      </div>
      
      {/* Returns Table */}
      <div className="card shadow-sm">
        <div className="card-header text-black">
          <h5 className="mb-0">Returns & Recalls</h5>
        </div>
        <div className="card-body">
          {returnRequests.length === 0 ? (
            <p className="text-center text-muted">No return requests found</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Return ID</th>
                    <th>Facility</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {returnRequests.map((request) => (
                    request.items.map((item, index) => (
                      <tr key={`${request.id}-${index}`}>
                        <td>{request.id}</td>
                        <td>{request.facility}</td>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{request.reason}</td>
                        <td>
                          <span className={`badge ${getStatusClass(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openViewModal(request)}
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            {request.status === 'Pending Verification' && (
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => openVerifyModal(request)}
                                title="Verify Receipt"
                              >
                                <FaCheck />
                              </button>
                            )}
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => openStatusModal(request)}
                              title="Update Status"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Create Return Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowCreateModal(false);
        }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><FaPlus className="me-2" /> Create Return Request</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Facility</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={facility}
                        onChange={(e) => setFacility(e.target.value)}
                        placeholder="e.g., Main Hospital"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Return Reason</label>
                      <select 
                        className="form-select" 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)}
                        required
                      >
                        <option value="">Select reason</option>
                        <option value="Defective">Defective</option>
                        <option value="Near expiry">Near expiry</option>
                        <option value="Recall">Recall</option>
                        <option value="Wrong item">Wrong item</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Items</label>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Batch #</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <input 
                                  type="text" 
                                  className="form-control form-control-sm" 
                                  value={item.name}
                                  onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                  required
                                />
                              </td>
                              <td>
                                <input 
                                  type="number" 
                                  className="form-control form-control-sm" 
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                  required
                                />
                              </td>
                              <td>
                                <input 
                                  type="text" 
                                  className="form-control form-control-sm" 
                                  value={item.batchNumber}
                                  onChange={(e) => handleItemChange(item.id, 'batchNumber', e.target.value)}
                                  required
                                />
                              </td>
                              <td>
                                <button 
                                  type="button" 
                                  className="btn btn-sm btn-danger"
                                  onClick={() => removeItemRow(item.id)}
                                  disabled={items.length === 1}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-outline-primary mt-2"
                      onClick={addItemRow}
                    >
                      <FaPlus className="me-1" /> Add Item
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Quarantine Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={quarantineLocation}
                      onChange={(e) => setQuarantineLocation(e.target.value)}
                      placeholder="e.g., Warehouse A, Section B"
                      required
                    />
                  </div>
                  
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Submit Return Request</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Modal */}
      {showViewModal && currentRequest && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowViewModal(false);
        }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Return Details: {currentRequest.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p><strong>Facility:</strong> {currentRequest.facility}</p>
                    <p><strong>Reason:</strong> {currentRequest.reason}</p>
                    <p><strong>Quarantine Location:</strong> {currentRequest.quarantineLocation}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Date:</strong> {currentRequest.date}</p>
                    <p><strong>Status:</strong> <span className={`badge ${getStatusClass(currentRequest.status)}`}>{currentRequest.status}</span></p>
                  </div>
                </div>
                
                <h6 className="mb-3">Items</h6>
                <div className="table-responsive mb-4">
                  <table className="table table-sm table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Batch #</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRequest.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.batchNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <h6 className="mb-3">Audit Trail</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Action</th>
                        <th>User</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRequest.auditTrail.map((log, index) => (
                        <tr key={index}>
                          <td>{log.action}</td>
                          <td>{log.user}</td>
                          <td>{log.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Verify Receipt Modal */}
      {showVerifyModal && currentRequest && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowVerifyModal(false);
        }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Verify Return Receipt</h5>
                <button type="button" className="btn-close" onClick={() => setShowVerifyModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to verify the receipt of return <strong>{currentRequest.id}</strong> from <strong>{currentRequest.facility}</strong>?</p>
                <div className="alert alert-info">
                  This action will update the status to "Verified" and record the verification in the audit trail.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowVerifyModal(false)}>Cancel</button>
                <button type="button" className="btn btn-success" onClick={handleVerifyReceipt}>
                  <FaCheck className="me-2" /> Verify Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Update Status Modal */}
      {showStatusModal && currentRequest && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowStatusModal(false);
        }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Return Status</h5>
                <button type="button" className="btn-close" onClick={() => setShowStatusModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Return ID</label>
                  <input type="text" className="form-control" value={currentRequest.id} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Current Status</label>
                  <input type="text" className="form-control" value={currentRequest.status} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Status</label>
                  <select 
                    className="form-select" 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">Select new status</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Verified">Verified</option>
                    <option value="Processed">Processed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStatusModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleStatusUpdate}>
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Backdrop */}
      {(showCreateModal || showViewModal || showVerifyModal || showStatusModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default ReturnsRecalls;