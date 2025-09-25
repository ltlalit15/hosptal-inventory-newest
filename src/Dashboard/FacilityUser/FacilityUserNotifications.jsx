import React, { useState } from 'react';
import { 
  FaBell, FaCheck, FaExclamationTriangle, FaInfoCircle, FaSearch, 
  FaFilter, FaEye, FaCalendarAlt, FaMapMarkerAlt, FaClock, 
  FaCheckCircle, FaTimesCircle, FaTruck, FaCheckSquare
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const FacilityUserNotifications = () => {
  // State for notifications and filters
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'stock_delivered', 
      title: 'Stock Delivered', 
      message: 'Your requested medical supplies have been delivered', 
      timestamp: '2023-07-15 10:30 AM', 
      read: false,
      details: {
        deliveryId: 'DEL-001',
        deliveredBy: 'Warehouse Team',
        deliveryDate: '2023-07-15',
        items: [
          { name: 'Medical Gloves', quantity: 50, unit: 'boxes' },
          { name: 'Face Masks', quantity: 200, unit: 'pieces' }
        ],
        deliveryLocation: 'Pharmacy - Building B, Ground Floor'
      }
    },
    { 
      id: 2, 
      type: 'request_approved', 
      title: 'Request Approved', 
      message: 'Your surgical equipment request has been approved', 
      timestamp: '2023-07-14 3:45 PM', 
      read: false,
      details: {
        requestId: 'REQ-002',
        approvedBy: 'Dr. Johnson',
        approvedDate: '2023-07-14',
        items: [
          { name: 'Scalpel Set', quantity: 5, unit: 'sets' },
          { name: 'Forceps', quantity: 10, unit: 'pieces' }
        ]
      }
    },
    { 
      id: 3, 
      type: 'request_rejected', 
      title: 'Request Rejected', 
      message: 'Your pharmaceutical items request has been rejected', 
      timestamp: '2023-07-13 11:20 AM', 
      read: true,
      details: {
        requestId: 'REQ-003',
        rejectedBy: 'Dr. Williams',
        rejectedDate: '2023-07-13',
        items: [
          { name: 'Antibiotics', quantity: 30, unit: 'bottles' },
          { name: 'Painkillers', quantity: 50, unit: 'strips' }
        ],
        reason: 'Request rejected due to budget constraints. Please resubmit next quarter.'
      }
    },
    { 
      id: 4, 
      type: 'request_delayed', 
      title: 'Request Delayed', 
      message: 'Your PPE equipment request has been delayed', 
      timestamp: '2023-07-12 2:15 PM', 
      read: true,
      details: {
        requestId: 'REQ-004',
        delayedBy: 'Supply Chain Team',
        delayedDate: '2023-07-12',
        items: [
          { name: 'Gowns', quantity: 100, unit: 'pieces' },
          { name: 'Face Shields', quantity: 50, unit: 'pieces' }
        ],
        newExpectedDate: '2023-07-25',
        reason: 'Delay due to supplier shortage. New delivery expected by July 25th.'
      }
    }
  ]);
  
  // State for filters and modal
  const [filterType, setFilterType] = useState('all');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showMarkAsReadModal, setShowMarkAsReadModal] = useState(false);
  const [notificationToMark, setNotificationToMark] = useState(null);
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // Helper functions
  // Function to get notification icon
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'stock_delivered':
        return <FaTruck className="text-success" />;
      case 'request_approved':
        return <FaCheckCircle className="text-success" />;
      case 'request_rejected':
        return <FaTimesCircle className="text-danger" />;
      case 'request_delayed':
        return <FaExclamationTriangle className="text-warning" />;
      default:
        return <FaBell className="text-secondary" />;
    }
  };
  
  // Function to get notification badge class
  const getNotificationBadgeClass = (type) => {
    switch(type) {
      case 'stock_delivered':
        return 'bg-success';
      case 'request_approved':
        return 'bg-success';
      case 'request_rejected':
        return 'bg-danger';
      case 'request_delayed':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  };
  
  // Function to get notification type label
  const getNotificationTypeLabel = (type) => {
    switch(type) {
      case 'stock_delivered':
        return 'Stock Delivered';
      case 'request_approved':
        return 'Request Approved';
      case 'request_rejected':
        return 'Request Rejected';
      case 'request_delayed':
        return 'Request Delayed';
      default:
        return 'Notification';
    }
  };
  
  // Filter notifications based on selected type and search term
  const filteredNotifications = notifications.filter(notification => {
    // First apply type filter
    const typeMatch = filterType === 'all' || notification.type === filterType;
    
    // Then apply search filter if search term is not empty
    const searchMatch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getNotificationTypeLabel(notification.type).toLowerCase().includes(searchTerm.toLowerCase());
    
    return typeMatch && searchMatch;
  });
  
  // Function to open notification details modal
  const openNotificationDetails = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
  };
  
  // Function to open mark as read confirmation modal
  const openMarkAsReadModal = (notification) => {
    setNotificationToMark(notification);
    setShowMarkAsReadModal(true);
  };
  
  // Function to mark notification as read
  const handleMarkAsRead = () => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationToMark.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    setShowMarkAsReadModal(false);
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      {/* Header Section - Responsive */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h1 className="h3 mb-1">Notifications</h1>
          <p className="text-muted mb-0">Stay updated with your request status</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="text-end me-3">
            <div className="text-muted small">Department: Pharmacy</div>
            <div>User: Dr. Sharma</div>
          </div>
          <div className="position-relative">
            <FaBell className="fs-4" />
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Filter Card - Responsive */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 p-3 p-md-4">
          <div className="flex-column flex-md-row d-flex justify-content-between align-items-md-center gap-3">
            <h5 className="mb-0">Filter Notifications</h5>
            <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto">
              <div className="input-group input-group-sm">
                <span className="input-group-text"><FaSearch /></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search notifications..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="form-select form-select-sm" 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="stock_delivered">Stock Delivered</option>
                <option value="request_approved">Request Approved</option>
                <option value="request_rejected">Request Rejected</option>
                <option value="request_delayed">Request Delayed</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-5">
              <FaBell className="text-muted mb-3" size={48} />
              <h4>No notifications found</h4>
              <p className="text-muted">Try adjusting your filter criteria</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Notification</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map(notification => (
                    <tr key={notification.id} className={!notification.read ? 'table-light' : ''}>
                      <td>
                        <div className="d-flex align-items-start">
                          <div className="me-3 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div>
                            <h6 className="mb-1">
                              {notification.title}
                              {!notification.read && (
                                <span className="badge bg-primary ms-2">New</span>
                              )}
                            </h6>
                            <p className="mb-1 text-muted">{notification.message}</p>
                            <small className="text-muted d-flex align-items-center">
                              <FaClock className="me-1 flex-shrink-0" />
                              <span>{notification.timestamp}</span>
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getNotificationBadgeClass(notification.type)}`}>
                          {getNotificationTypeLabel(notification.type)}
                        </span>
                      </td>
                      <td>{notification.timestamp}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openNotificationDetails(notification)}
                            title="View Detail"
                          >
                            <FaEye />
                          </button>
                          {!notification.read && (
                            <button 
                              className="btn btn-sm btn-outline-success"
                              onClick={() => openMarkAsReadModal(notification)}
                              title="Mark as Read"
                            >
                              <FaCheckSquare />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Notification Details Modal - Responsive */}
      <div className={`modal fade ${showNotificationModal ? 'show' : ''}`} style={{ display: showNotificationModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Notification Details</h5>
              <button type="button" className="btn-close" onClick={() => setShowNotificationModal(false)}></button>
            </div>
            <div className="modal-body">
              {selectedNotification && (
                <>
                  <div className="row mb-4">
                    <div className="col-12 col-md-8 mb-3 mb-md-0">
                      <h4 className="mb-2">{selectedNotification.title}</h4>
                      <p className="text-muted">{selectedNotification.message}</p>
                      <div className="d-flex align-items-center text-muted">
                        <FaClock className="me-2 flex-shrink-0" />
                        <span>{selectedNotification.timestamp}</span>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 text-md-end">
                      <span className={`badge ${getNotificationBadgeClass(selectedNotification.type)} fs-6`}>
                        {getNotificationIcon(selectedNotification.type)} {getNotificationTypeLabel(selectedNotification.type)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card mb-4">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">Details</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12 col-md-6">
                          {selectedNotification.type === 'stock_delivered' && (
                            <>
                              <p className="mb-2"><strong>Delivery ID:</strong> {selectedNotification.details.deliveryId}</p>
                              <p className="mb-2"><strong>Delivered By:</strong> {selectedNotification.details.deliveredBy}</p>
                              <p className="mb-2"><strong>Delivery Date:</strong> {selectedNotification.details.deliveryDate}</p>
                            </>
                          )}
                          {(selectedNotification.type === 'request_approved' || selectedNotification.type === 'request_rejected' || selectedNotification.type === 'request_delayed') && (
                            <>
                              <p className="mb-2"><strong>Request ID:</strong> {selectedNotification.details.requestId}</p>
                              {selectedNotification.type === 'request_approved' && (
                                <>
                                  <p className="mb-2"><strong>Approved By:</strong> {selectedNotification.details.approvedBy}</p>
                                  <p className="mb-2"><strong>Approved Date:</strong> {selectedNotification.details.approvedDate}</p>
                                </>
                              )}
                              {selectedNotification.type === 'request_rejected' && (
                                <>
                                  <p className="mb-2"><strong>Rejected By:</strong> {selectedNotification.details.rejectedBy}</p>
                                  <p className="mb-2"><strong>Rejected Date:</strong> {selectedNotification.details.rejectedDate}</p>
                                </>
                              )}
                              {selectedNotification.type === 'request_delayed' && (
                                <>
                                  <p className="mb-2"><strong>Delayed By:</strong> {selectedNotification.details.delayedBy}</p>
                                  <p className="mb-2"><strong>Delayed Date:</strong> {selectedNotification.details.delayedDate}</p>
                                  <p className="mb-2"><strong>New Expected Date:</strong> {selectedNotification.details.newExpectedDate}</p>
                                </>
                              )}
                            </>
                          )}
                        </div>
                        <div className="col-12 col-md-6">
                          {selectedNotification.type === 'stock_delivered' && (
                            <p className="mb-2"><strong>Delivery Location:</strong> {selectedNotification.details.deliveryLocation}</p>
                          )}
                          {(selectedNotification.type === 'request_rejected' || selectedNotification.type === 'request_delayed') && (
                            <p className="mb-2"><strong>Reason:</strong> {selectedNotification.details.reason}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">Items</h5>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Item Name</th>
                              <th>Quantity</th>
                              <th>Unit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedNotification.details.items.map((item, index) => (
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
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary w-100 w-md-auto" onClick={() => setShowNotificationModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mark as Read Confirmation Modal */}
      <div className={`modal fade ${showMarkAsReadModal ? 'show' : ''}`} style={{ display: showMarkAsReadModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Mark as Read</h5>
              <button type="button" className="btn-close" onClick={() => setShowMarkAsReadModal(false)}></button>
            </div>
            <div className="modal-body">
              {notificationToMark && (
                <p>Are you sure you want to mark "<strong>{notificationToMark.title}</strong>" as read?</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowMarkAsReadModal(false)}>Cancel</button>
              <button type="button" className="btn btn-success" onClick={handleMarkAsRead}>
                <FaCheckSquare className="me-1" /> Mark as Read
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Backdrops */}
      {showNotificationModal && <div className="modal-backdrop fade show"></div>}
      {showMarkAsReadModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default FacilityUserNotifications;