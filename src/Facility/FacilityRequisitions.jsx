// src/App.jsx
import { useState } from 'react';

function FacilityRequisitions() {
  // Admin's facility (hardcoded for this example)
  const adminFacility = 'Kumasi Branch Hospital';
  
  // Updated initial requisitions data with flat structure
  const initialRequisitions = [
    {
      id: '#REQ-0042',
      facility: 'Kumasi Branch Hospital',
      user: 'Dr. Amoah',
      item: 'Paracetamol 500mg',
      qty: 10,
      facilityStock: 15,
      status: 'Pending'
    },
    {
      id: '#REQ-0043',
      facility: 'Kumasi Branch Hospital',
      user: 'Nurse Akua',
      item: 'Surgical Gloves (L)',
      qty: 20,
      facilityStock: 15,
      status: 'Pending'
    },
    {
      id: '#REQ-0044',
      facility: 'Kumasi Branch Hospital',
      user: 'Dr. Boateng',
      item: 'Children\'s Paracetamol',
      qty: 15,
      facilityStock: 0,
      status: 'Pending'
    },
    {
      id: '#REQ-0045',
      facility: 'Kumasi Branch Hospital',
      user: 'Pharmacist Adwoa',
      item: 'Cough Syrup',
      qty: 12,
      facilityStock: 8,
      status: 'Processing'
    },
    {
      id: '#REQ-0046',
      facility: 'Kumasi Branch Hospital',
      user: 'Dr. Osei',
      item: 'Surgical Masks',
      qty: 50,
      facilityStock: 100,
      status: 'Delivered'
    },
    {
      id: '#REQ-0047',
      facility: 'Kumasi Branch Hospital',
      user: 'Lab Tech. Ama',
      item: 'Ibuprofen 400mg',
      qty: 7,
      facilityStock: 50,
      status: 'Completed'
    }
  ];

  // State management
  const [activeTab, setActiveTab] = useState('all');
  const [requisitions, setRequisitions] = useState(initialRequisitions);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [deliverQty, setDeliverQty] = useState('');
  const [deliverRemarks, setDeliverRemarks] = useState('');
  const [raisePriority, setRaisePriority] = useState('Normal');
  const [raiseRemarks, setRaiseRemarks] = useState('');
  const [raiseRequiredQty, setRaiseRequiredQty] = useState('');

  // Filter requisitions based on admin's facility and active tab
  const filteredRequisitions = requisitions.filter(req => {
    // Only show requisitions from admin's facility
    if (req.facility !== adminFacility) return false;
    
    if (activeTab === 'pending') {
      return req.status === 'Pending';
    } else if (activeTab === 'processing') {
      return req.status === 'Processing';
    } else if (activeTab === 'delivered') {
      return req.status === 'Delivered';
    } else if (activeTab === 'completed') {
      return req.status === 'Completed';
    }
    return true;
  });

  // Handle deliver action
  const handleDeliver = (req) => {
    setSelectedRequisition(req);
    setDeliverQty(req.qty.toString());
    setDeliverRemarks('');
    setShowDeliverModal(true);
  };

  // Handle raise to warehouse action
  const handleRaiseToWarehouse = (req) => {
    setSelectedRequisition(req);
    setRaisePriority('Normal');
    setRaiseRemarks('');
    setRaiseRequiredQty(req.qty.toString());
    setShowRaiseModal(true);
  };

  // Submit deliver action
  const submitDeliver = () => {
    if (!deliverQty || parseInt(deliverQty) <= 0 || parseInt(deliverQty) > selectedRequisition.facilityStock) {
      alert('Please enter a valid deliver quantity');
      return;
    }
    
    setRequisitions(requisitions.map(req => 
      req.id === selectedRequisition.id 
        ? { ...req, status: 'Delivered' } 
        : req
    ));
    
    setShowDeliverModal(false);
    setSelectedRequisition(null);
    setDeliverQty('');
    setDeliverRemarks('');
  };

  // Submit raise to warehouse action
  const submitRaiseToWarehouse = () => {
    if (!raiseRequiredQty || parseInt(raiseRequiredQty) <= 0) {
      alert('Please enter a valid required quantity');
      return;
    }
    
    setRequisitions(requisitions.map(req => 
      req.id === selectedRequisition.id 
        ? { ...req, status: 'Processing' } 
        : req
    ));
    
    setShowRaiseModal(false);
    setSelectedRequisition(null);
    setRaisePriority('Normal');
    setRaiseRemarks('');
    setRaiseRequiredQty('');
  };

  // Close modals
  const closeDeliverModal = () => {
    setShowDeliverModal(false);
    setSelectedRequisition(null);
    setDeliverQty('');
    setDeliverRemarks('');
  };

  const closeRaiseModal = () => {
    setShowRaiseModal(false);
    setSelectedRequisition(null);
    setRaisePriority('Normal');
    setRaiseRemarks('');
    setRaiseRequiredQty('');
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="mb-0">Requisitions</h1>
          <p className="text-muted mb-0">Manage requisitions for {adminFacility}</p>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} 
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`} 
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'processing' ? 'active' : ''}`} 
            onClick={() => setActiveTab('processing')}
          >
            Processing
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'delivered' ? 'active' : ''}`} 
            onClick={() => setActiveTab('delivered')}
          >
            Delivered
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`} 
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </li>
      </ul>

      {/* Requisitions Table */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Req ID</th>
                <th>User</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Facility Stock</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequisitions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No requisitions found for {adminFacility}.
                  </td>
                </tr>
              ) : (
                filteredRequisitions.map((req) => (
                  <tr key={req.id}>
                    <td className="fw-medium">{req.id}</td>
                    <td>{req.user}</td>
                    <td>{req.item}</td>
                    <td>{req.qty}</td>
                    <td>{req.facilityStock}</td>
                    <td>
                      <span className={`badge rounded-pill ${
                        req.status === 'Pending' 
                          ? 'bg-secondary-subtle text-secondary-emphasis' 
                          : req.status === 'Processing' 
                            ? 'bg-warning-subtle text-warning-emphasis' 
                            : req.status === 'Delivered' 
                              ? 'bg-info-subtle text-info-emphasis' 
                              : 'bg-success-subtle text-success-emphasis'
                      } px-3 py-1`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        {req.status === 'Pending' && req.facilityStock >= req.qty && (
                          <button 
                            className="btn btn-sm btn-success" 
                            onClick={() => handleDeliver(req)}
                            title="Deliver"
                          >
                            Deliver
                          </button>
                        )}
                        {req.status === 'Pending' && req.facilityStock < req.qty && (
                          <button 
                            className="btn btn-sm btn-primary" 
                            onClick={() => handleRaiseToWarehouse(req)}
                            title="Raise to Warehouse"
                          >
                            Raise to Warehouse
                          </button>
                        )}
                        {req.status === 'Delivered' && (
                          <button 
                            className="btn btn-sm btn-success" 
                            onClick={() => setRequisitions(requisitions.map(r => 
                              r.id === req.id ? { ...r, status: 'Completed' } : r
                            ))}
                            title="Mark as Completed"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deliver Modal */}
      {showDeliverModal && selectedRequisition && (
        <div 
          className="modal fade show" 
          tabIndex="-1" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} 
          onClick={closeDeliverModal}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Deliver Item</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeDeliverModal}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row mb-3">
                  <div className="col-5 fw-bold text-muted">Req ID:</div>
                  <div className="col-7">{selectedRequisition.id}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-5 fw-bold text-muted">Item:</div>
                  <div className="col-7">{selectedRequisition.item}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-5 fw-bold text-muted">Qty:</div>
                  <div className="col-7">{selectedRequisition.qty}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Deliver Qty</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={deliverQty} 
                    onChange={(e) => setDeliverQty(e.target.value)} 
                    min="1" 
                    max={selectedRequisition.facilityStock}
                    required 
                  />
                  <div className="form-text">
                    Available stock: {selectedRequisition.facilityStock}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Remarks</label>
                  <textarea 
                    className="form-control" 
                    value={deliverRemarks} 
                    onChange={(e) => setDeliverRemarks(e.target.value)} 
                    rows="2"
                    placeholder="Optional remarks"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <div className="d-flex flex-column flex-sm-row gap-2 w-100">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary w-100" 
                    onClick={closeDeliverModal}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-success w-100" 
                    onClick={submitDeliver}
                  >
                    Deliver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raise to Warehouse Modal */}
      {showRaiseModal && selectedRequisition && (
        <div 
          className="modal fade show" 
          tabIndex="-1" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} 
          onClick={closeRaiseModal}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Raise to Warehouse</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeRaiseModal}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row mb-3">
                  <div className="col-5 fw-bold text-muted">Req ID:</div>
                  <div className="col-7">{selectedRequisition.id}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-5 fw-bold text-muted">Item Name:</div>
                  <div className="col-7">{selectedRequisition.item}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-5 fw-bold text-muted">Requested Qty:</div>
                  <div className="col-7">{selectedRequisition.qty}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-5 fw-bold text-muted">Available Qty:</div>
                  <div className="col-7">{selectedRequisition.facilityStock}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Required Qty</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={raiseRequiredQty} 
                    onChange={(e) => setRaiseRequiredQty(e.target.value)} 
                    min="1" 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <select 
                    className="form-select" 
                    value={raisePriority} 
                    onChange={(e) => setRaisePriority(e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Remarks</label>
                  <textarea 
                    className="form-control" 
                    value={raiseRemarks} 
                    onChange={(e) => setRaiseRemarks(e.target.value)} 
                    rows="2"
                    placeholder="Optional remarks"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <div className="d-flex flex-column flex-sm-row gap-2 w-100">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary w-100" 
                    onClick={closeRaiseModal}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary w-100" 
                    onClick={submitRaiseToWarehouse}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacilityRequisitions;