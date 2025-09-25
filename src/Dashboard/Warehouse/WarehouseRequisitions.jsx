import React, { useState } from 'react';
import { FaPlus, FaSearch, FaEye, FaFilePdf } from 'react-icons/fa';

const WarehouseRequisitions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showPartialApproveModal, setShowPartialApproveModal] = useState(false);
  const [currentRequisition, setCurrentRequisition] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [rejectingRequisition, setRejectingRequisition] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approveQty, setApproveQty] = useState('');
  const [remarks, setRemarks] = useState('');
  const [partialApproveQty, setPartialApproveQty] = useState('');
  const [partialRemarks, setPartialRemarks] = useState('');

  const [requisitions, setRequisitions] = useState([
    {
      id: '#REQ-0042',
      facility: 'Kumasi Branch Hospital',
      department: 'Emergency',
      requestedBy: 'Dr. Amoah',
      date: '24 Oct 2023',
      items: [
        { name: 'Paracetamol 500mg', quantity: 100, unit: 'Tablets' },
        { name: 'Surgical Gloves', quantity: 50, unit: 'Pairs' }
      ],
      priority: 'High',
      status: 'Pending',
    },
    {
      id: '#REQ-0040',
      facility: 'Takoradi Clinic',
      department: 'Pharmacy',
      requestedBy: 'Dr. Mensah',
      date: '22 Oct 2023',
      items: [
        { name: 'Amoxicillin 250mg', quantity: 50, unit: 'Capsules' },
        { name: 'Bandages', quantity: 30, unit: 'Pieces' }
      ],
      priority: 'Medium',
      status: 'Approved',
    },
    {
      id: '#REQ-0038',
      facility: 'Accra Central Hospital',
      department: 'Laboratory',
      requestedBy: 'Lab Tech. Ama',
      date: '20 Oct 2023',
      items: [
        { name: 'Test Tubes', quantity: 100, unit: 'Pieces' }
      ],
      priority: 'Low',
      status: 'Rejected',
    },
    {
      id: '#REQ-0037',
      facility: 'Cape Coast Clinic',
      department: 'OPD',
      requestedBy: 'Nurse Kofi',
      date: '19 Oct 2023',
      items: [
        { name: 'Thermometers', quantity: 10, unit: 'Pieces' }
      ],
      priority: 'High',
      status: 'Dispatched',
    }
  ]);

  const PriorityBadge = ({ priority }) => {
    const priorityColors = {
      High: 'bg-danger',
      Medium: 'bg-warning',
      Low: 'bg-success'
    };
    return (
      <span className={`badge ${priorityColors[priority] || 'bg-secondary'} text-dark`}>
        {priority}
      </span>
    );
  };

  const StatusBadge = ({ status }) => {
    const statusColors = {
      Pending: 'bg-warning',
      Approved: 'bg-success',
      Rejected: 'bg-danger',
      Dispatched: 'bg-info'
    };
    return (
      <span className={`badge ${statusColors[status] || 'bg-secondary'} text-dark`}>
        {status}
      </span>
    );
  };

  const openApproveModal = (req, item) => {
    setCurrentRequisition(req);
    setCurrentItem(item);
    setApproveQty(item.quantity);
    setRemarks('');
    setShowApproveModal(true);
  };

  const openPartialApproveModal = (req, item) => {
    setCurrentRequisition(req);
    setCurrentItem(item);
    setPartialApproveQty(item.quantity);
    setPartialRemarks('');
    setShowPartialApproveModal(true);
  };

  const openRejectModal = (req) => {
    setRejectingRequisition(req);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleApproveSubmit = () => {
    setRequisitions(requisitions.map(req =>
      req.id === currentRequisition.id
        ? { ...req, status: 'Approved' }
        : req
    ));
    setShowApproveModal(false);
  };

  const handlePartialApproveSubmit = () => {
    if (!partialApproveQty || partialApproveQty <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    setRequisitions(requisitions.map(req => {
      if (req.id === currentRequisition.id) {
        const updatedItems = req.items.map(item => 
          item.name === currentItem.name 
            ? { ...item, approvedQuantity: parseInt(partialApproveQty) } 
            : item
        );
        return { ...req, status: 'Partially Approved', items: updatedItems };
      }
      return req;
    }));
    
    setShowPartialApproveModal(false);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    setRequisitions(requisitions.map(req =>
      req.id === rejectingRequisition.id
        ? { ...req, status: 'Rejected', rejectionReason }
        : req
    ));
    setShowRejectModal(false);
  };

  const filteredRequisitions = requisitions.filter(req =>
    req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.facility.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Requisitions (From Facilities)</h2>
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search requisitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-secondary">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row row-cols-1 row-cols-md-4 mb-4 g-3">
        {['Pending', 'Approved', 'Rejected', 'Dispatched'].map(status => (
          <div className="col" key={status}>
            <div className="card border-0 shadow-sm h-100">
              <div className={`card-body bg-${status === 'Pending' ? 'warning' : status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'info'} bg-opacity-10 p-4`}>
                <div className="d-flex align-items-center">
                  <div className={`bg-${status === 'Pending' ? 'warning' : status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'info'} bg-opacity-25 rounded-circle p-3 me-3`}>
                    <FaEye size={24} className={`text-${status === 'Pending' ? 'warning' : status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'info'}`} />
                  </div>
                  <div>
                    <h5 className={`card-title text-${status === 'Pending' ? 'warning' : status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'info'} fw-bold mb-0`}>
                      {requisitions.filter(r => r.status === status).length}
                    </h5>
                    <p className="card-text text-muted">{status} Requests</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Req ID</th>
                  <th>Facility</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequisitions.map((req, index) => (
                  req.items.map((item, idx) => (
                    <tr key={`${index}-${idx}`}>
                      <td>{req.id}</td>
                      <td>{req.facility}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity} {item.unit}</td>
                      <td><StatusBadge status={req.status} /></td>
                      <td className="d-flex gap-1">
                        <button className="btn btn-sm btn-success" onClick={() => openApproveModal(req, item)}>Approve</button>
                        <button className="btn btn-sm btn-warning" onClick={() => openPartialApproveModal(req, item)}>Partial Approve</button>
                        <button className="btn btn-sm btn-danger" onClick={() => openRejectModal(req)}>Reject</button>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && currentRequisition && currentItem && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowApproveModal(false);
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Approve Requisition</h5>
                <button type="button" className="btn-close" onClick={() => setShowApproveModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Requisition ID:</strong> {currentRequisition.id}</p>
                <p><strong>Facility Name:</strong> {currentRequisition.facility}</p>
                <p><strong>Item Name:</strong> {currentItem.name}</p>
                <p><strong>Requested Qty:</strong> {currentItem.quantity} {currentItem.unit}</p>

                <div className="mb-3">
                  <label className="form-label">Approve Qty</label>
                  <input
                    type="number"
                    className="form-control"
                    value={approveQty}
                    onChange={(e) => setApproveQty(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Remarks</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowApproveModal(false)}>Cancel</button>
                <button className="btn btn-success" onClick={handleApproveSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partial Approve Modal */}
      {showPartialApproveModal && currentRequisition && currentItem && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowPartialApproveModal(false);
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Partially Approve Requisition</h5>
                <button type="button" className="btn-close" onClick={() => setShowPartialApproveModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Requisition ID:</strong> {currentRequisition.id}</p>
                <p><strong>Facility Name:</strong> {currentRequisition.facility}</p>
                <p><strong>Item Name:</strong> {currentItem.name}</p>
                <p><strong>Requested Qty:</strong> {currentItem.quantity} {currentItem.unit}</p>

                <div className="mb-3">
                  <label className="form-label">Approve Qty <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={partialApproveQty}
                    onChange={(e) => setPartialApproveQty(e.target.value)}
                    max={currentItem.quantity}
                    min="1"
                  />
                  <small className="text-muted">Maximum: {currentItem.quantity} {currentItem.unit}</small>
                </div>
                <div className="mb-3">
                  <label className="form-label">Remarks</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={partialRemarks}
                    onChange={(e) => setPartialRemarks(e.target.value)}
                    placeholder="Reason for partial approval"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPartialApproveModal(false)}>Cancel</button>
                <button className="btn btn-warning" onClick={handlePartialApproveSubmit}>Partially Approve</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && rejectingRequisition && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowRejectModal(false);
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Reject Requisition</h5>
                <button type="button" className="btn-close" onClick={() => setShowRejectModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Requisition ID:</strong> {rejectingRequisition.id}</p>
                <textarea
                  className="form-control"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="3"
                  placeholder="Reason for rejection"
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleReject}>Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showApproveModal || showPartialApproveModal || showRejectModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default WarehouseRequisitions;