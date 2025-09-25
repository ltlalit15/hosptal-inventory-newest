import React, { useState } from 'react';
import { 
  FaClipboardList, FaEye, FaSearch, FaFilter, FaPaperPlane, 
  FaCheck, FaTimes, FaExclamationTriangle, FaClock, FaCalendarAlt,
  FaPlus, FaTrash
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const FacilityUserMyRequests = () => {
  // State for modals
  const [showStatusTimelineModal, setShowStatusTimelineModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data for requests with simplified status
  const [requests, setRequests] = useState([
    { 
      id: 1, 
      title: 'Medical Supplies Request', 
      description: 'Request for additional medical gloves and face masks', 
      submittedDate: '2023-07-10', 
      status: 'Completed',
      items: [
        { name: 'Medical Gloves', quantity: 50, unit: 'boxes' },
        { name: 'Face Masks', quantity: 200, unit: 'pieces' }
      ]
    },
    { 
      id: 2, 
      title: 'Surgical Equipment', 
      description: 'Request for new surgical instruments for operating theater', 
      submittedDate: '2023-07-12', 
      status: 'Delivered',
      items: [
        { name: 'Scalpel Set', quantity: 5, unit: 'sets' },
        { name: 'Forceps', quantity: 10, unit: 'pieces' }
      ]
    },
    { 
      id: 3, 
      title: 'Pharmaceutical Items', 
      description: 'Request for various medicines for the ward', 
      submittedDate: '2023-07-14', 
      status: 'Processing',
      items: [
        { name: 'Antibiotics', quantity: 30, unit: 'bottles' },
        { name: 'Painkillers', quantity: 50, unit: 'strips' }
      ]
    },
    { 
      id: 4, 
      title: 'PPE Equipment', 
      description: 'Request for personal protective equipment', 
      submittedDate: '2023-07-15', 
      status: 'Pending',
      items: [
        { name: 'Gowns', quantity: 100, unit: 'pieces' },
        { name: 'Face Shields', quantity: 50, unit: 'pieces' }
      ]
    }
  ]);
  
  // Filter requests based on search term
  const filteredRequests = requests.filter(request => {
    return (
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Function to open status timeline modal
  const openStatusTimeline = (request) => {
    setSelectedRequest(request);
    setShowStatusTimelineModal(true);
  };
  
  // Function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Pending':
        return 'bg-secondary';
      case 'Processing':
        return 'bg-warning text-dark';
      case 'Delivered':
        return 'bg-info';
      case 'Completed':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };
  
  // Function to get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending':
        return <FaClock className="text-secondary" />;
      case 'Processing':
        return <FaExclamationTriangle className="text-warning" />;
      case 'Delivered':
        return <FaPaperPlane className="text-info" />;
      case 'Completed':
        return <FaCheck className="text-success" />;
      default:
        return <FaClock className="text-secondary" />;
    }
  };
  
  // Function to get step status
  const getStepStatus = (currentStatus, stepStatus) => {
    const statusOrder = ['Pending', 'Processing', 'Delivered', 'Completed'];
    const currentIdx = statusOrder.indexOf(currentStatus);
    const stepIdx = statusOrder.indexOf(stepStatus);
    
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };
  
  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      {/* Header Section - Responsive */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h1 className="h3 mb-1">My Requests</h1>
          <p className="text-muted mb-0">Track and manage your requisition requests</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="text-end me-3">
            <div className="text-muted small">Department: Pharmacy</div>
            <div>User: Dr. Sharma</div>
          </div>
          <div className="bg-light rounded-circle p-2 flex-shrink-0">
            <FaClipboardList size={24} className="text-primary" />
          </div>
        </div>
      </div>
      
      {/* Main Card - Responsive */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 p-3 p-md-4">
          <div className="flex-column flex-md-row d-flex justify-content-between align-items-md-center gap-3">
            <h5 className="mb-0">Request Status Timeline</h5>
            <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto">
              <div className="input-group input-group-sm">
                <span className="input-group-text"><FaSearch /></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search requests..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-sm btn-outline-secondary flex-shrink-0">
                <FaFilter />
              </button>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th className="d-none d-md-table-cell">Description</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.title}</td>
                    <td className="d-none d-md-table-cell">{request.description}</td>
                    <td>{request.submittedDate}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                        {getStatusIcon(request.status)} {request.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => openStatusTimeline(request)}>
                        <FaEye /> <span className="d-none d-md-inline-block ms-1">View Status Timeline</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Status Timeline Modal */}
      <div className={`modal fade ${showStatusTimelineModal ? 'show' : ''}`} style={{ display: showStatusTimelineModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Request Status Timeline</h5>
              <button type="button" className="btn-close" onClick={() => setShowStatusTimelineModal(false)}></button>
            </div>
            <div className="modal-body">
              {selectedRequest && (
                <div className="timeline-container">
                  <div className="d-flex flex-column flex-md-row justify-content-between position-relative">
                    {/* Timeline line */}
                    <div className="timeline-line position-absolute top-0 bottom-0 start-50 translate-middle-x"></div>
                    
                    {/* Timeline steps */}
                    {['Pending', 'Processing', 'Delivered', 'Completed'].map((status, index) => {
                      const stepStatus = getStepStatus(selectedRequest.status, status);
                      return (
                        <div key={status} className="text-center mb-4 flex-grow-1">
                          <div className={`timeline-step rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${
                            stepStatus === 'completed' ? 'bg-success' : 
                            stepStatus === 'current' ? 'bg-primary' : 
                            'bg-light border'
                          }`} style={{ width: '40px', height: '40px' }}>
                            {stepStatus === 'completed' ? (
                              <FaCheck className="text-white" />
                            ) : stepStatus === 'current' ? (
                              <span className="text-white fw-bold">{index + 1}</span>
                            ) : (
                              <span className="text-muted">{index + 1}</span>
                            )}
                          </div>
                          <div className={`fw-bold ${
                            stepStatus === 'completed' || stepStatus === 'current' ? 'text-primary' : 'text-muted'
                          }`}>
                            {status}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Request details */}
                  <div className="mt-4 p-3 bg-light rounded">
                    <h6 className="mb-2">{selectedRequest.title}</h6>
                    <p className="text-muted small mb-2">{selectedRequest.description}</p>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Submitted: {selectedRequest.submittedDate}</span>
                      <span className={`badge ${getStatusBadgeClass(selectedRequest.status)}`}>
                        {getStatusIcon(selectedRequest.status)} {selectedRequest.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary w-100 w-md-auto" onClick={() => setShowStatusTimelineModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Backdrop */}
      {showStatusTimelineModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default FacilityUserMyRequests;