import React, { useState } from 'react';
import {
  FaSearch, FaEye,  FaExchangeAlt
} from 'react-icons/fa';

const SuperAdminRequisitions = () => {
  // === STATIC MOCK DATA (Flattened for table: one row per primary item) ===
  const mockRequisitions = [
    {
      id: '#REQ-0042',
      facility: 'Kumasi Branch Hospital',
      item: 'Paracetamol 500mg',
      qty: 200,
      status: 'Pending Review',
      raisedOn: '2023-10-24',
      details: [
        { name: 'Paracetamol 500mg', quantity: 200, unit: 'Tablets' },
        { name: 'IV Fluids (Normal Saline)', quantity: 50, unit: 'Bottles' }
      ]
    },
    {
      id: '#REQ-0041',
      facility: 'Accra Central Hospital',
      item: 'Gloves (Medium)',
      qty: 100,
      status: 'Approved',
      raisedOn: '2023-10-23',
      details: [
        { name: 'Gloves (Medium)', quantity: 100, unit: 'Pairs' },
        { name: 'Face Masks (Surgical)', quantity: 200, unit: 'Pieces' }
      ]
    },
    {
      id: '#REQ-0040',
      facility: 'Takoradi Clinic',
      item: 'Thermometers',
      qty: 10,
      status: 'Partially Approved',
      raisedOn: '2023-10-22',
      details: [
        { name: 'Thermometers', quantity: 10, unit: 'Units' }
      ]
    },
    {
      id: '#REQ-0039',
      facility: 'Cape Coast Hospital',
      item: 'Test Kits (Malaria)',
      qty: 300,
      status: 'Rejected',
      raisedOn: '2023-10-21',
      details: [
        { name: 'Test Kits (Malaria)', quantity: 300, unit: 'Kits' }
      ],
      rejectionReason: 'Budget exceeded for this category.'
    }
  ];

  // === STATE ===
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Pending');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [currentRequisition, setCurrentRequisition] = useState(null);
  const [overrideStatus, setOverrideStatus] = useState('');

  // === FILTER LOGIC ===
  const filteredRequisitions = mockRequisitions.filter(req => {
    if (activeTab === 'Pending') {
      return req.status === 'Pending Review' || req.status === 'Partially Approved';
    } else if (activeTab === 'Approved') {
      return req.status === 'Approved';
    } else if (activeTab === 'Rejected') {
      return req.status === 'Rejected';
    } else {
      return true;
    }
  });

  const filteredBySearch = filteredRequisitions.filter(r => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      r.id.toLowerCase().includes(q) ||
      r.facility.toLowerCase().includes(q) ||
      r.item.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  });

  // === BADGES ===
  const StatusBadge = ({ status }) => {
    const map = {
      'Pending Review': 'bg-warning text-dark',
      'Partially Approved': 'bg-info text-dark',
      'Approved': 'bg-success',
      'Rejected': 'bg-danger'
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
  };

  // === MODAL HANDLERS ===
  const openViewModal = (req) => {
    setCurrentRequisition(req);
    setShowViewModal(true);
  };

  const openOverrideModal = (req) => {
    setCurrentRequisition(req);
    setOverrideStatus(req.status);
    setShowOverrideModal(true);
  };

  // === ACTION HANDLERS ===
  const handleOverrideStatus = () => {
    if (!overrideStatus.trim()) return;
    alert(`Status overridden to: ${overrideStatus} (UI demo)`);
    setShowOverrideModal(false);
  };

  return (
    <div className="container-fluid py-3">
      {/* ===== Top Toolbar ===== */}
      <div className="d-flex flex-row flex-wrap justify-content-between align-items-center gap-2 mb-4">
  <h2 className="fw-bold mb-0">Requisitions (Global)</h2>
  <div className="ms-auto" style={{ maxWidth: '300px', width: '100%' }}>
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        style={{ height: "40px" }}
        placeholder="Search requisitions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="btn btn-outline-secondary" style={{ height: "40px" }} type="button">
        <FaSearch />
      </button>
    </div>
  </div>
</div>
      {/* ===== Summary Cards ===== */}
      <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body bg-danger bg-opacity-10 p-4">
              <div className="d-flex align-items-center mb-2">
                <FaEye className="text-danger me-2" size={24} />
                <h5 className="card-title text-danger fw-bold mb-0">Pending</h5>
              </div>
              <p className="card-text text-muted ms-4 mb-0">
                {mockRequisitions.filter(r => ['Pending Review', 'Partially Approved'].includes(r.status)).length} requisitions need review
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body bg-success bg-opacity-10 p-4">
              <div className="d-flex align-items-center mb-2">
                <FaEye className="text-success me-2" size={24} />
                <h5 className="card-title text-success fw-bold mb-0">Approved</h5>
              </div>
              <p className="card-text text-muted ms-4 mb-0">
                {mockRequisitions.filter(r => r.status === 'Approved').length} approved
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body bg-danger bg-opacity-10 p-4">
              <div className="d-flex align-items-center mb-2">
                <FaEye className="text-danger me-2" size={24} />
                <h5 className="card-title text-danger fw-bold mb-0">Rejected</h5>
              </div>
              <p className="card-text text-muted ms-4 mb-0">
                {mockRequisitions.filter(r => r.status === 'Rejected').length} rejected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-3">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'Pending' ? 'active' : ''}`} onClick={() => setActiveTab('Pending')}>
                Pending
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'Approved' ? 'active' : ''}`} onClick={() => setActiveTab('Approved')}>
                Approved
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'Rejected' ? 'active' : ''}`} onClick={() => setActiveTab('Rejected')}>
                Rejected
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'All' ? 'active' : ''}`} onClick={() => setActiveTab('All')}>
                All Requisitions
              </button>
            </li>
          </ul>
        </div>

        {/* ===== Data Views ===== */}
        <div className="card-body p-0">
          {/* TABLE - Desktop */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-hover mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Req ID</th>
                  <th>Facility</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Raised On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBySearch.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">No requisitions found.</td></tr>
                ) : (
                  filteredBySearch.map((req, i) => (
                    <tr key={i}>
                      <td className="fw-bold">{req.id}</td>
                      <td>{req.facility}</td>
                      <td>{req.item}</td>
                      <td>{req.qty}</td>
                      <td><StatusBadge status={req.status} /></td>
                      <td>{new Date(req.raisedOn).toLocaleDateString()}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openViewModal(req)}
                          >
                            <FaEye /> View Detail
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openOverrideModal(req)}
                          >
                            Override Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* CARD LIST - Mobile */}
          <div className="d-block d-md-none p-2">
            <div className="row g-2">
              {filteredBySearch.length === 0 ? (
                <div className="col-12">
                  <div className="alert alert-light border text-center mb-0">No requisitions found.</div>
                </div>
              ) : (
                filteredBySearch.map((req, i) => (
                  <div className="col-12" key={i}>
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold">{req.id}</span>
                          <StatusBadge status={req.status} />
                        </div>
                        <div className="row g-2 small">
                          <div className="col-6"><div className="text-muted">Facility</div><div>{req.facility}</div></div>
                          <div className="col-6"><div className="text-muted">Item</div><div>{req.item}</div></div>
                          <div className="col-6"><div className="text-muted">Qty</div><div>{req.qty}</div></div>
                          <div className="col-6"><div className="text-muted">Raised On</div><div>{new Date(req.raisedOn).toLocaleDateString()}</div></div>
                        </div>
                        <div className="d-flex gap-2 mt-3">
                          <button className="btn btn-outline-primary flex-fill" onClick={() => openViewModal(req)}>
                            <FaEye className="me-1" /> View Detail
                          </button>
                          <button className="btn btn-outline-secondary flex-fill" onClick={() => openOverrideModal(req)}>
                            Override Status
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== VIEW MODAL ===== */}
      {showViewModal && currentRequisition && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Requisition Details: {currentRequisition.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Facility:</strong> {currentRequisition.facility}</p>
                    <p><strong>Raised On:</strong> {new Date(currentRequisition.raisedOn).toLocaleDateString()}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Status:</strong> <StatusBadge status={currentRequisition.status} /></p>
                  </div>
                </div>
                <h6 className="mt-3">All Items Requested</h6>
                <table className="table table-sm">
                  <thead><tr><th>Item</th><th>Qty</th><th>Unit</th></tr></thead>
                  <tbody>
                    {currentRequisition.details.map((item, i) => (
                      <tr key={i}><td>{item.name}</td><td>{item.quantity}</td><td>{item.unit}</td></tr>
                    ))}
                  </tbody>
                </table>
                {currentRequisition.rejectionReason && (
                  <div className="alert alert-danger mt-3">
                    <strong>Rejection Reason:</strong> {currentRequisition.rejectionReason}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== OVERRIDE STATUS MODAL ===== */}
      {showOverrideModal && currentRequisition && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Override Status</h5>
                <button type="button" className="btn-close" onClick={() => setShowOverrideModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Override status for requisition <strong>{currentRequisition.id}</strong></p>
                <div className="mb-3">
                  <label className="form-label">New Status</label>
                  <select
                    className="form-select"
                    value={overrideStatus}
                    onChange={(e) => setOverrideStatus(e.target.value)}
                  >
                    <option value="Pending Review">Pending Review</option>
                    <option value="Partially Approved">Partially Approved</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="alert alert-warning">
                  <strong>Note:</strong> This will bypass normal approval workflow. Use only when necessary.
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowOverrideModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleOverrideStatus}>Confirm Override</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(showViewModal || showOverrideModal) && (
        <div className="modal-backdrop show"></div>
      )}
    </div>
  );
};

export default SuperAdminRequisitions;