import React, { useState } from 'react';
import { 
  FaPlus, FaSearch, FaEye, FaTruckLoading, FaCheck, FaTimes, FaFilePdf, FaEnvelope, FaSms, FaBoxOpen
} from 'react-icons/fa';

const WarehouseDispatches = () => {
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showMarkDeliveredModal, setShowMarkDeliveredModal] = useState(false);
  // State for current dispatch
  const [currentDispatch, setCurrentDispatch] = useState(null);
  // State for new dispatch form
  const [newDispatch, setNewDispatch] = useState({
    facility: '',
    items: '',
    dispatchedBy: '',
    estimatedDelivery: '',
    notes: '',
    batchNumbers: ''
  });
  // State for current document type
  const [currentDocumentType, setCurrentDocumentType] = useState('');
  // State for notification
  const [notificationMethod, setNotificationMethod] = useState('email');
  
  // Mock data for dispatches
  const [dispatches, setDispatches] = useState([
    { 
      id: '#DSP-0102', 
      facility: 'Kumasi Branch Hospital', 
      items: [
        { name: 'Paracetamol 500mg', quantity: 100, unit: 'Tablets' },
        { name: 'Surgical Gloves', quantity: 50, unit: 'Pairs' }
      ],
      dispatchedBy: 'Warehouse Admin', 
      date: '23 Oct 2023', 
      status: 'In Transit',
      estimatedDelivery: '24 Oct 2023',
      trackingNumber: 'TRK-2023-0015',
      notes: 'Urgent delivery for emergency ward',
      batchNumbers: 'B123, B456',
      notificationSent: false
    },
    { 
      id: '#DSP-0101', 
      facility: 'Accra Central Hospital', 
      items: [
        { name: 'Amoxicillin 250mg', quantity: 50, unit: 'Capsules' },
        { name: 'Bandages', quantity: 30, unit: 'Pieces' }
      ],
      dispatchedBy: 'Warehouse Admin', 
      date: '22 Oct 2023', 
      status: 'Delivered',
      estimatedDelivery: '23 Oct 2023',
      trackingNumber: 'TRK-2023-0014',
      notes: 'Routine supply for pharmacy department',
      batchNumbers: 'B789',
      notificationSent: false
    },
    { 
      id: '#DSP-0100', 
      facility: 'Takoradi Clinic', 
      items: [
        { name: 'Test Tubes', quantity: 100, unit: 'Pieces' }
      ],
      dispatchedBy: 'Warehouse Admin', 
      date: '21 Oct 2023', 
      status: 'In Transit',
      estimatedDelivery: '25 Oct 2023',
      trackingNumber: 'TRK-2023-0013',
      notes: 'Laboratory supplies',
      currentLocation: 'Cape Town Distribution Center',
      progress: 65,
      batchNumbers: 'B321, B654',
      notificationSent: false
    }
  ]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      'Delivered': 'bg-success text-white',
      'In Transit': 'bg-warning text-dark',
      'Processing': 'bg-info text-white',
      'Cancelled': 'bg-danger text-white',
      'Received': 'bg-primary text-white'
    };
    return (
      <span className={`badge ${statusColors[status] || 'bg-secondary'} rounded-pill px-3 py-1 fw-medium`}>
        {status}
      </span>
    );
  };

  // Modal handlers
  const openCreateModal = () => {
    setNewDispatch({
      facility: '',
      items: '',
      dispatchedBy: '',
      estimatedDelivery: '',
      notes: '',
      batchNumbers: ''
    });
    setShowCreateModal(true);
  };

  const openViewModal = (dispatch) => {
    setCurrentDispatch(dispatch);
    setShowViewModal(true);
  };

  const openMarkDeliveredModal = (dispatch) => {
    setCurrentDispatch(dispatch);
    setShowMarkDeliveredModal(true);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDispatch({
      ...newDispatch,
      [name]: value
    });
  };

  // Action handlers
  const handleCreateDispatch = () => {
    if (!newDispatch.facility || !newDispatch.dispatchedBy) {
      alert('Please fill Facility and Dispatched By fields.');
      return;
    }

    const newItem = {
      id: `#DSP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      facility: newDispatch.facility,
      items: [{ name: newDispatch.items, quantity: 1, unit: 'item' }],
      dispatchedBy: newDispatch.dispatchedBy,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'In Transit',
      estimatedDelivery: newDispatch.estimatedDelivery,
      trackingNumber: `TRK-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      notes: newDispatch.notes,
      batchNumbers: newDispatch.batchNumbers || 'Not specified',
      notificationSent: false
    };
    setDispatches([newItem, ...dispatches]);
    setShowCreateModal(false);
  };

  const handleMarkDelivered = () => {
    if (!currentDispatch) return;
    
    // Update dispatch status to "Delivered"
    const updatedDispatches = dispatches.map(dispatch => {
      if (dispatch.id === currentDispatch.id) {
        return {
          ...dispatch,
          status: 'Delivered'
        };
      }
      return dispatch;
    });
    
    setDispatches(updatedDispatches);
    setCurrentDispatch({
      ...currentDispatch,
      status: 'Delivered'
    });
    
    // Show success message
    alert(`Dispatch ${currentDispatch.id} has been marked as delivered!`);
    setShowMarkDeliveredModal(false);
  };

  // Filter dispatches by search term
  const filteredDispatches = dispatches.filter(dispatch =>
    dispatch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.facility.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Dispatches Management</h2>
        <button className="btn btn-primary d-flex align-items-center" onClick={openCreateModal}>
          <FaPlus className="me-2" /> New Dispatch
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaCheck className="text-success fa-2x" />
              </div>
              <div className="number text-success fw-bold">
                {dispatches.filter(d => d.status === 'Delivered').length}
              </div>
              <div className="label text-muted">Delivered</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaTruckLoading className="text-warning fa-2x" />
              </div>
              <div className="number text-warning fw-bold">
                {dispatches.filter(d => d.status === 'In Transit').length}
              </div>
              <div className="label text-muted">In Transit</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaTimes className="text-info fa-2x" />
              </div>
              <div className="number text-info fw-bold">0</div>
              <div className="label text-muted">Delayed</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaPlus className="text-primary fa-2x" />
              </div>
              <div className="number text-primary fw-bold">0</div>
              <div className="label text-muted">Pending</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dispatches Table */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-3 pb-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Recent Dispatches</h5>
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search dispatches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-secondary">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Dispatch ID</th>
                  <th>Facility</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDispatches.map((dispatch, index) => (
                  dispatch.items.map((item, itemIndex) => (
                    <tr key={`${index}-${itemIndex}`}>
                      <td><span className="fw-bold">{dispatch.id}</span></td>
                      <td>{dispatch.facility}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity} {item.unit}</td>
                      <td><StatusBadge status={dispatch.status} /></td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openViewModal(dispatch)}
                            title="View Details"
                          >
                            <FaEye className="me-1" />
                            View
                          </button>
                          {dispatch.status === 'In Transit' && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => openMarkDeliveredModal(dispatch)}
                              title="Mark as Delivered"
                            >
                              <FaCheck className="me-1" />
                              Delivered
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
          {filteredDispatches.length === 0 && (
            <div className="p-4 text-center text-muted">
              No dispatches found matching your search.
            </div>
          )}
        </div>
      </div>
      
      {/* ========== MODALS ========== */}
      {/* Create Dispatch Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowCreateModal(false);
        }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Create New Dispatch</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">To Facility <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="facility"
                        value={newDispatch.facility}
                        onChange={handleInputChange}
                        placeholder="e.g. Kumasi Branch Hospital"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Dispatched By <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="dispatchedBy"
                        value={newDispatch.dispatchedBy}
                        onChange={handleInputChange}
                        placeholder="e.g. Warehouse Admin"
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Estimated Delivery Date</label>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        name="estimatedDelivery"
                        value={newDispatch.estimatedDelivery}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Items</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="items"
                        value={newDispatch.items}
                        onChange={handleInputChange}
                        placeholder="e.g. Medical Supplies"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Batch Numbers</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="batchNumbers"
                        value={newDispatch.batchNumbers}
                        onChange={handleInputChange}
                        placeholder="e.g. B123, B456"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Notes</label>
                      <textarea
                        className="form-control form-control-lg"
                        name="notes"
                        value={newDispatch.notes}
                        onChange={handleInputChange}
                        rows="1"
                        placeholder="Additional notes"
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary px-4" onClick={handleCreateDispatch}>
                  Create Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Dispatch Modal */}
      {showViewModal && currentDispatch && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowViewModal(false);
        }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Dispatch Details: {currentDispatch.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p><strong>To Facility:</strong> {currentDispatch.facility}</p>
                    <p><strong>Dispatched By:</strong> {currentDispatch.dispatchedBy}</p>
                    <p><strong>Dispatch Date:</strong> {currentDispatch.date}</p>
                    <p><strong>Batch Numbers:</strong> {currentDispatch.batchNumbers}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Tracking Number:</strong> {currentDispatch.trackingNumber}</p>
                    <p><strong>Estimated Delivery:</strong> {currentDispatch.estimatedDelivery}</p>
                    <p><strong>Status:</strong> <StatusBadge status={currentDispatch.status} /></p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h6 className="mb-3">Items</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDispatch.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mb-3">
                  <h6 className="mb-2">Notes:</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      {currentDispatch.notes}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Mark Delivered Modal */}
      {showMarkDeliveredModal && currentDispatch && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowMarkDeliveredModal(false);
        }}>
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Mark as Delivered</h5>
                <button type="button" className="btn-close" onClick={() => setShowMarkDeliveredModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <p>Are you sure you want to mark dispatch <strong>{currentDispatch.id}</strong> to <strong>{currentDispatch.facility}</strong> as delivered?</p>
                <div className="alert alert-info">
                  This action will update the status from "In Transit" to "Delivered".
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowMarkDeliveredModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success px-4" onClick={handleMarkDelivered}>
                  <FaCheck className="me-2" /> Mark as Delivered
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Backdrop */}
      {(showCreateModal || showViewModal || showMarkDeliveredModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default WarehouseDispatches;