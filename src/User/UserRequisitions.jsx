// src/App.jsx
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


function UserRequisitions() {
  // Initial requisitions data
  const initialRequisitions = [
    {
      id: '#REQ - 0042',
      facility: 'Kumasi Branch Hospital',
      department: 'Emergency',
      requester: 'Dr. Amoah',
      date: '24 Oct 2023',
      itemCount: '12 items',
      priority: 'High',
      status: 'Pending Review'
    },
    {
      id: '#REQ - 0040',
      facility: 'Takoradi Clinic',
      department: 'Pharmacy',
      requester: 'Dr. Mensah',
      date: '22 Oct 2023',
      itemCount: '5 items',
      priority: 'Medium',
      status: 'Partially Approved'
    },
    {
      id: '#REQ - 0038',
      facility: 'Accra Central Hospital',
      department: 'Laboratory',
      requester: 'Lab Tech. Ama',
      date: '20 Oct 2023',
      itemCount: '7 items',
      priority: 'Low',
      status: 'Pending Review'
    }
  ];

  // State management
  const [activeTab, setActiveTab] = useState('pending');
  const [requisitions, setRequisitions] = useState(initialRequisitions);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRequisition, setViewRequisition] = useState(null);
  const [newRequisition, setNewRequisition] = useState({
    facility: '',
    department: '',
    requester: '',
    itemCount: '',
    priority: 'Medium'
  });

  // Filter requisitions based on active tab
  const filteredRequisitions = requisitions.filter(req => {
    if (activeTab === 'pending') {
      return req.status === 'Pending Review' || req.status === 'Partially Approved';
    } else if (activeTab === 'approved') {
      return req.status === 'Approved';
    } else if (activeTab === 'rejected') {
      return req.status === 'Rejected';
    }
    return true;
  });

  // Handle approve action
  const handleApprove = (id) => {
    setRequisitions(requisitions.map(req => 
      req.id === id ? { ...req, status: 'Approved' } : req
    ));
  };

  // Handle reject action
  const handleReject = (id) => {
    setRequisitions(requisitions.map(req => 
      req.id === id ? { ...req, status: 'Rejected' } : req
    ));
  };

  // Handle view action
  const handleView = (requisition) => {
    setViewRequisition(requisition);
    setShowViewModal(true);
  };

  // Handle create modal open
  const handleCreateModalOpen = () => {
    setShowCreateModal(true);
  };

  // Handle create modal close
  const handleCreateModalClose = () => {
    setShowCreateModal(false);
    setNewRequisition({
      facility: '',
      department: '',
      requester: '',
      itemCount: '',
      priority: 'Medium'
    });
  };

  // Handle view modal close
  const handleViewModalClose = () => {
    setShowViewModal(false);
    setViewRequisition(null);
  };

  // Handle input change in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequisition({ ...newRequisition, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate new ID
    const newId = `#REQ - ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Create new requisition object
    const requisitionToAdd = {
      id: newId,
      facility: newRequisition.facility,
      department: newRequisition.department,
      requester: newRequisition.requester,
      date: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }).replace(/ /g, ' '),
      itemCount: `${newRequisition.itemCount} items`,
      priority: newRequisition.priority,
      status: 'Pending Review'
    };
    
    // Add to requisitions list
    setRequisitions([...requisitions, requisitionToAdd]);
    
    // Close modal and reset form
    handleCreateModalClose();
  };

  return (
    <div className="container mt-4">
      {/* Header with Create Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Requisitions Management</h1>
        <button className="btn btn-primary" onClick={handleCreateModalOpen}>
          Create Requisition
        </button>
      </div>
      
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
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
            className={`nav-link ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
        </li>
      </ul>
      
      {/* Requisitions Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>Requisition ID</th>
              <th>Facility</th>
              <th>Department</th>
              <th>Requester</th>
              <th>Date</th>
              <th>Item Count</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequisitions.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.facility}</td>
                <td>{req.department}</td>
                <td>{req.requester}</td>
                <td>{req.date}</td>
                <td>{req.itemCount}</td>
                <td>
                  <span className={`badge ${
                    req.priority === 'High' ? 'bg-danger' : 
                    req.priority === 'Medium' ? 'bg-warning' : 'bg-info'
                  }`}>
                    {req.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    req.status === 'Approved' ? 'bg-success' : 
                    req.status === 'Rejected' ? 'bg-danger' : 
                    req.status === 'Partially Approved' ? 'bg-warning' : 'bg-secondary'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => handleApprove(req.id)}
                      disabled={req.status === 'Approved'}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleReject(req.id)}
                      disabled={req.status === 'Rejected'}
                    >
                      Reject
                    </button>
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => handleView(req)}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Create Requisition Modal */}
      {showCreateModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Requisition</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCreateModalClose}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Facility</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="facility"
                      value={newRequisition.facility}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="department"
                      value={newRequisition.department}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Requester</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="requester"
                      value={newRequisition.requester}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Item Count</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="itemCount"
                      value={newRequisition.itemCount}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select 
                      className="form-select" 
                      name="priority"
                      value={newRequisition.priority}
                      onChange={handleInputChange}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={handleCreateModalClose}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Requisition Modal */}
      {showViewModal && viewRequisition && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Requisition Details</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleViewModalClose}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-4 fw-bold">Requisition ID:</div>
                  <div className="col-8">{viewRequisition.id}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-4 fw-bold">Facility:</div>
                  <div className="col-8">{viewRequisition.facility}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-4 fw-bold">Department:</div>
                  <div className="col-8">{viewRequisition.department}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-4 fw-bold">Requester:</div>
                  <div className="col-8">{viewRequisition.requester}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-4 fw-bold">Date:</div>
                  <div className="col-8">{viewRequisition.date}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-4 fw-bold">Item Count:</div>
                  <div className="col-8">{viewRequisition.itemCount}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-4 fw-bold">Priority:</div>
                  <div className="col-8">
                    <span className={`badge ${
                      viewRequisition.priority === 'High' ? 'bg-danger' : 
                      viewRequisition.priority === 'Medium' ? 'bg-warning' : 'bg-info'
                    }`}>
                      {viewRequisition.priority}
                    </span>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4 fw-bold">Status:</div>
                  <div className="col-8">
                    <span className={`badge ${
                      viewRequisition.status === 'Approved' ? 'bg-success' : 
                      viewRequisition.status === 'Rejected' ? 'bg-danger' : 
                      viewRequisition.status === 'Partially Approved' ? 'bg-warning' : 'bg-secondary'
                    }`}>
                      {viewRequisition.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleViewModalClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserRequisitions;