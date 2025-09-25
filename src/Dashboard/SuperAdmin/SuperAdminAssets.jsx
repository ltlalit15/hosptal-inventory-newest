import React, { useState } from 'react';
import {
  FaSearch, FaEye, FaEdit, FaUserPlus, FaUserMinus
} from 'react-icons/fa';

const SuperAdminAssets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [newAsset, setNewAsset] = useState({
    id: '',
    name: '',
    category: 'Medical Equipment',
    assignedTo: '',
    status: 'Available'
  });
  const [assignForm, setAssignForm] = useState({ assignedTo: '' });

  // Mock data (simplified)
  const [assets, setAssets] = useState([
    {
      id: 'AST-1001',
      name: 'Ventilator',
      category: 'Medical Equipment',
      assignedTo: 'Dr. Amoah',
      status: 'In Use'
    },
    {
      id: 'AST-1002',
      name: 'Ultrasound Machine',
      category: 'Diagnostic',
      assignedTo: 'Dr. Mensah',
      status: 'In Use'
    },
    {
      id: 'AST-1003',
      name: 'Patient Monitor',
      category: 'Medical Equipment',
      assignedTo: 'Maintenance Team',
      status: 'Available'
    }
  ]);

  // Badges
  const StatusBadge = ({ status }) => {
    const map = {
      'In Use': 'bg-success',
      'Available': 'bg-info text-dark',
      'Retired': 'bg-secondary'
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
  };

  // Handlers
  const openViewModal = (asset) => { setCurrentAsset(asset); setShowViewModal(true); };
  const openEditModal = (asset) => { setNewAsset(asset); setShowEditModal(true); };
  const openAssignModal = (asset) => {
    setCurrentAsset(asset);
    setAssignForm({ assignedTo: asset.assignedTo || '' });
    setShowAssignModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setNewAsset(prev => ({ ...prev, [name]: value }));
  };

  const handleAssignChange = (e) => {
    setAssignForm({ assignedTo: e.target.value });
  };

  const handleEditAsset = () => {
    setAssets(prev => prev.map(a => (a.id === newAsset.id ? newAsset : a)));
    setShowEditModal(false);
  };

  const handleAssignAsset = () => {
    setAssets(prev =>
      prev.map(a =>
        a.id === currentAsset.id
          ? { ...a, assignedTo: assignForm.assignedTo.trim() || '' }
          : a
      )
    );
    setShowAssignModal(false);
  };

  // Search
  const filtered = assets.filter(a => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      a.id.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.assignedTo.toLowerCase().includes(q) ||
      a.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container-fluid py-3">
      {/* Toolbar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-2 mb-4">
        <h2 className="fw-bold mb-0">Assets Management</h2>
        <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2 w-90 w-md-auto">
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ height: "40px" }}
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search assets"
            />
            <button className="btn btn-outline-secondary btn-sm" style={{ height: "40px" }} type="button">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

   {/* Stats */}
<div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
  <div className="col">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body text-center p-4">
        <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
          <span className="text-success fs-3">🏢</span>
        </div>
        <div className="text-success fw-bold fs-4">{assets.length}</div>
        <div className="text-muted small">Total Assets</div>
      </div>
    </div>
  </div>
  <div className="col">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body text-center p-4">
        <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
          <span className="text-primary fs-3">✅</span>
        </div>
        <div className="text-primary fw-bold fs-4">
          {assets.filter(a => a.status === 'In Use').length}
        </div>
        <div className="text-muted small">In Use</div>
      </div>
    </div>
  </div>
  <div className="col">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body text-center p-4">
        <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
          <span className="text-warning fs-3">🔧</span>
        </div>
        <div className="text-warning fw-bold fs-4">
          {assets.filter(a => a.status === 'Available' && a.assignedTo).length} {/* Adjust as needed */}
        </div>
        <div className="text-muted small">Under Maintenance</div>
      </div>
    </div>
  </div>
  <div className="col">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body text-center p-4">
        <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
          <span className="text-info fs-3">⚠️</span>
        </div>
        <div className="text-info fw-bold fs-4">
          {assets.filter(a => a.status === 'Available' && !a.assignedTo).length}
        </div>
        <div className="text-muted small">Need Attention</div>
      </div>
    </div>
  </div>
</div>

      {/* Assets Table / Card List */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold">Hospital Assets</h5>
        </div>

        {/* TABLE (md and up) */}
        <div className="card-body p-0 d-none d-md-block">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Asset ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th className="text-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((asset) => (
                  <tr key={asset.id}>
                    <td className="fw-bold">{asset.id}</td>
                    <td>{asset.name}</td>
                    <td>{asset.category}</td>
                    <td>{asset.assignedTo || '—'}</td>
                    <td><StatusBadge status={asset.status} /></td>
                    <td>
                      <div className="btn-group" role="group">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openViewModal(asset)}>
                          <FaEye />
                        </button>
                        <button className="btn btn-sm btn-outline-warning" onClick={() => openEditModal(asset)}>
                          <FaEdit />
                        </button>
                        <button
                          className={`btn btn-sm ${asset.assignedTo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          onClick={() => openAssignModal(asset)}
                        >
                          {asset.assignedTo ? <FaUserMinus /> : <FaUserPlus />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CARD LIST (mobile) */}
        <div className="card-body d-block d-md-none">
          <div className="row g-2">
            {filtered.map((a) => (
              <div className="col-12" key={a.id}>
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold">{a.id}</span>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="row g-2 small">
                      <div className="col-6">
                        <div className="text-muted">Name</div>
                        <div>{a.name}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">Type</div>
                        <div>{a.category}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">Assigned To</div>
                        <div>{a.assignedTo || '—'}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">Status</div>
                        <div><StatusBadge status={a.status} /></div>
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-outline-primary w-100 btn-sm" onClick={() => openViewModal(a)}>
                        <FaEye className="me-1" /> View
                      </button>
                      <button className="btn btn-outline-warning w-100 btn-sm" onClick={() => openEditModal(a)}>
                        <FaEdit className="me-1" /> Edit
                      </button>
                      <button
                        className={`btn w-100 btn-sm ${a.assignedTo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={() => openAssignModal(a)}
                      >
                        {a.assignedTo ? <><FaUserMinus className="me-1" /> Unassign</> : <><FaUserPlus className="me-1" /> Assign</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-12">
                <div className="alert alert-light border text-center mb-0">No assets found.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && currentAsset && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Asset Details: {currentAsset.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {currentAsset.name}</p>
                <p><strong>Type:</strong> {currentAsset.category}</p>
                <p><strong>Assigned To:</strong> {currentAsset.assignedTo || '—'}</p>
                <p><strong>Status:</strong> <StatusBadge status={currentAsset.status} /></p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Asset: {newAsset.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" name="name" value={newAsset.name} onChange={handleEditChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select className="form-select" name="category" value={newAsset.category} onChange={handleEditChange}>
                    <option value="Medical Equipment">Medical Equipment</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Furniture">Furniture</option>
                    <option value="IT Equipment">IT Equipment</option>
                    <option value="Vehicle">Vehicle</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Assigned To</label>
                  <input type="text" className="form-control" name="assignedTo" value={newAsset.assignedTo} onChange={handleEditChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="status" value={newAsset.status} onChange={handleEditChange}>
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-warning" onClick={handleEditAsset}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign/Unassign Modal */}
      {showAssignModal && currentAsset && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentAsset.assignedTo ? 'Unassign Asset' : 'Assign Asset'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Asset:</strong> {currentAsset.name} ({currentAsset.id})</p>
                {currentAsset.assignedTo && (
                  <p className="text-danger"><strong>Currently Assigned To:</strong> {currentAsset.assignedTo}</p>
                )}
                <div className="mb-3">
                  <label className="form-label">
                    {currentAsset.assignedTo ? 'Leave empty to unassign' : 'Assign to (User / Department)'}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={assignForm.assignedTo}
                    onChange={handleAssignChange}
                    placeholder="e.g., Dr. Amoah, ICU"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                <button
                  className={`btn ${currentAsset.assignedTo ? 'btn-danger' : 'btn-success'}`}
                  onClick={handleAssignAsset}
                >
                  {currentAsset.assignedTo ? 'Unassign' : 'Assign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(showViewModal || showEditModal || showAssignModal) && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default SuperAdminAssets;