import React, { useState } from 'react';
import { 
  FaPlus, FaSearch, FaEye, FaEdit, FaUserCheck, FaUserTimes 
} from 'react-icons/fa';

const WarehouseAssets = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock warehouse assets
  const [assets, setAssets] = useState([
    { id: 'AST-2001', name: 'Ventilator', type: 'Medical Equipment', assignedTo: 'ICU Department', status: 'Assigned' },
    { id: 'AST-2002', name: 'X-Ray Machine', type: 'Diagnostic', assignedTo: 'Radiology Department', status: 'Assigned' },
    { id: 'AST-2003', name: 'ECG Monitor', type: 'Medical Equipment', assignedTo: 'Unassigned', status: 'Available' },
    { id: 'AST-2004', name: 'Patient Bed', type: 'Furniture', assignedTo: 'Ward A', status: 'Assigned' },
    { id: 'AST-2005', name: 'Infusion Pump', type: 'Medical Equipment', assignedTo: 'Unassigned', status: 'Available' }
  ]);

  // Status badge
  const StatusBadge = ({ status }) => {
    const statusColors = {
      'Assigned': 'bg-success',
      'Available': 'bg-primary',
      'Maintenance': 'bg-warning',
      'Retired': 'bg-secondary'
    };
    return <span className={`badge ${statusColors[status] || 'bg-secondary'}`}>{status}</span>;
  };

  // State for modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [assignTo, setAssignTo] = useState('');

  // Handle view action
  const handleView = (asset) => {
    setCurrentAsset(asset);
    setShowViewModal(true);
  };

  // Handle edit action
  const handleEdit = (asset) => {
    setCurrentAsset(asset);
    setShowEditModal(true);
  };

  // Handle assign/unassign action
  const handleAssignAction = (asset) => {
    setCurrentAsset(asset);
    setAssignTo(asset.assignedTo === 'Unassigned' ? '' : asset.assignedTo);
    setShowAssignModal(true);
  };

  // Submit assignment changes
  const handleAssignSubmit = () => {
    const updatedAssets = assets.map(asset => {
      if (asset.id === currentAsset.id) {
        return {
          ...asset,
          assignedTo: assignTo || 'Unassigned',
          status: assignTo ? 'Assigned' : 'Available'
        };
      }
      return asset;
    });
    
    setAssets(updatedAssets);
    setShowAssignModal(false);
    
    const action = assignTo ? 'assigned' : 'unassigned';
    alert(`Asset ${currentAsset.id} has been ${action} successfully!`);
  };

  // Filter assets based on search term
  const filteredAssets = assets.filter(asset =>
    asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Assets</h2>
        <div className="d-flex align-items-center gap-2">
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary">
              <FaSearch />
            </button>
          </div>
          <button className="btn btn-primary d-flex align-items-center">
            <FaPlus className="me-2" /> Add New Asset
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaUserCheck className="text-primary fa-2x" />
              </div>
              <div className="number text-primary fw-bold">
                {assets.filter(a => a.status === 'Assigned').length}
              </div>
              <div className="label text-muted">Assigned Assets</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center p-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaSearch className="text-success fa-2x" />
              </div>
              <div className="number text-success fw-bold">
                {assets.filter(a => a.status === 'Available').length}
              </div>
              <div className="label text-muted">Available Assets</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center p-4">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaEdit className="text-warning fa-2x" />
              </div>
              <div className="number text-warning fw-bold">
                {assets.filter(a => a.status === 'Maintenance').length}
              </div>
              <div className="label text-muted">In Maintenance</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center p-4">
              <div className="bg-secondary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaUserTimes className="text-secondary fa-2x" />
              </div>
              <div className="number text-secondary fw-bold">
                {assets.filter(a => a.status === 'Retired').length}
              </div>
              <div className="label text-muted">Retired Assets</div>
            </div>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold">Warehouse Asset Registry</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Asset ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset, index) => (
                  <tr key={index}>
                    <td><span className="fw-bold">{asset.id}</span></td>
                    <td>{asset.name}</td>
                    <td>{asset.type}</td>
                    <td>{asset.assignedTo}</td>
                    <td><StatusBadge status={asset.status} /></td>
                    <td>
                      <div className="btn-group" role="group">
                        <button 
                          className="btn btn-sm btn-outline-primary" 
                          title="View"
                          onClick={() => handleView(asset)}
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary" 
                          title="Edit"
                          onClick={() => handleEdit(asset)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className={`btn btn-sm ${asset.assignedTo === 'Unassigned' ? 'btn-outline-success' : 'btn-outline-warning'}`}
                          title={asset.assignedTo === 'Unassigned' ? 'Assign' : 'Unassign'}
                          onClick={() => handleAssignAction(asset)}
                        >
                          {asset.assignedTo === 'Unassigned' ? <FaUserCheck /> : <FaUserTimes />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAssets.length === 0 && (
            <div className="p-4 text-center text-muted">
              No assets found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* View Asset Modal */}
      {showViewModal && currentAsset && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowViewModal(false);
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Asset Details: {currentAsset.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p><strong>Asset ID:</strong> {currentAsset.id}</p>
                    <p><strong>Name:</strong> {currentAsset.name}</p>
                    <p><strong>Type:</strong> {currentAsset.type}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Assigned To:</strong> {currentAsset.assignedTo}</p>
                    <p><strong>Status:</strong> <StatusBadge status={currentAsset.status} /></p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {showEditModal && currentAsset && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowEditModal(false);
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Asset: {currentAsset.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Asset Name</label>
                  <input type="text" className="form-control" defaultValue={currentAsset.name} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Asset Type</label>
                  <input type="text" className="form-control" defaultValue={currentAsset.type} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Assigned To</label>
                  <input type="text" className="form-control" defaultValue={currentAsset.assignedTo} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" defaultValue={currentAsset.status}>
                    <option value="Assigned">Assigned</option>
                    <option value="Available">Available</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign/Unassign Modal */}
      {showAssignModal && currentAsset && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowAssignModal(false);
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentAsset.assignedTo === 'Unassigned' ? 'Assign Asset' : 'Unassign Asset'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Asset ID:</strong> {currentAsset.id}</p>
                <p><strong>Asset Name:</strong> {currentAsset.name}</p>
                <p><strong>Currently Assigned To:</strong> {currentAsset.assignedTo}</p>
                
                {currentAsset.assignedTo === 'Unassigned' ? (
                  <div className="mb-3">
                    <label className="form-label">Assign To</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={assignTo}
                      onChange={(e) => setAssignTo(e.target.value)}
                      placeholder="Enter department or user name"
                    />
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    Are you sure you want to unassign this asset from {currentAsset.assignedTo}?
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleAssignSubmit}>
                  {currentAsset.assignedTo === 'Unassigned' ? 'Assign' : 'Unassign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showViewModal || showEditModal || showAssignModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default WarehouseAssets;