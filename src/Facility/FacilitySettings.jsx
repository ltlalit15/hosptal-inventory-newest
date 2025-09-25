import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const FacilitySettings = () => {
  const [notifications, setNotifications] = useState({
    lowStockAlert: true,
    expiryAlert: true,
    requisitionSubmitted: true,
    requisitionApproved: true,
    requisitionRejected: true,
    deliveryReceived: true
  });

  const [approvalWorkflows, setApprovalWorkflows] = useState({
    requisitionApproval: 'Single',
    bulkRequisitionApproval: 'Multi-level',
    highValueThreshold: 5000,
    autoApproveLowValue: false
  });

  // Handle notification toggle
  const handleNotificationToggle = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Handle approval workflow change
  const handleApprovalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setApprovalWorkflows(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'highValueThreshold' ? parseInt(value) || 0 : value)
    }));
  };

  // Save settings
  const handleSaveNotifications = () => {
    alert('Notification settings saved!');
  };

  const handleSaveWorkflows = () => {
    alert('Approval workflow settings saved!');
  };

  return (
    <div className="container-fluid p-4">
      <h1 className="mb-0">Settings</h1>
      <p className="text-muted mb-4">
        Manage alerts and approvals for smoother operations.
      </p>


      <div className="row">
        {/* Notifications Card */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Notifications</h5>
            </div>
            <div className="card-body">
              <div className="mb-3 form-check">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    id="lowStockAlert"
                    checked={notifications.lowStockAlert}
                    onChange={() => handleNotificationToggle('lowStockAlert')}
                  />
                  <label htmlFor="lowStockAlert" className="form-check-label">
                    Low stock alerts
                  </label>
                </div>
              </div>

              <div className="mb-3 form-check">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    id="expiryAlert"
                    checked={notifications.expiryAlert}
                    onChange={() => handleNotificationToggle('expiryAlert')}
                  />
                  <label htmlFor="expiryAlert" className="form-check-label">
                    Expiry alerts
                  </label>
                </div>
              </div>

              <div className="mb-3 form-check">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    id="requisitionSubmitted"
                    checked={notifications.requisitionSubmitted}
                    onChange={() => handleNotificationToggle('requisitionSubmitted')}
                  />
                  <label htmlFor="requisitionSubmitted" className="form-check-label">
                    Requisition submitted
                  </label>
                </div>
              </div>

              <div className="mb-3 form-check">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    id="requisitionApproved"
                    checked={notifications.requisitionApproved}
                    onChange={() => handleNotificationToggle('requisitionApproved')}
                  />
                  <label htmlFor="requisitionApproved" className="form-check-label">
                    Requisition approved
                  </label>
                </div>
              </div>

              <div className="mb-3 form-check">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    id="requisitionRejected"
                    checked={notifications.requisitionRejected}
                    onChange={() => handleNotificationToggle('requisitionRejected')}
                  />
                  <label htmlFor="requisitionRejected" className="form-check-label">
                    Requisition rejected
                  </label>
                </div>
              </div>

              <div className="mb-3 form-check">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    id="deliveryReceived"
                    checked={notifications.deliveryReceived}
                    onChange={() => handleNotificationToggle('deliveryReceived')}
                  />
                  <label htmlFor="deliveryReceived" className="form-check-label">
                    Delivery received
                  </label>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSaveNotifications}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>

        {/* Approval Workflows Card */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Approval Workflows</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="requisitionApproval" className="form-label">Requisition Approval</label>
                <select
                  className="form-select"
                  id="requisitionApproval"
                  name="requisitionApproval"
                  value={approvalWorkflows.requisitionApproval}
                  onChange={handleApprovalChange}
                >
                  <option value="Single">Single-level approval</option>
                  <option value="Multi-level">Multi-level approval</option>
                  <option value="None">No approval required</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="bulkRequisitionApproval" className="form-label">Bulk Requisition Approval</label>
                <select
                  className="form-select"
                  id="bulkRequisitionApproval"
                  name="bulkRequisitionApproval"
                  value={approvalWorkflows.bulkRequisitionApproval}
                  onChange={handleApprovalChange}
                >
                  <option value="Single">Single-level approval</option>
                  <option value="Multi-level">Multi-level approval</option>
                  <option value="None">No approval required</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="highValueThreshold" className="form-label">High Value Threshold ($)</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="highValueThreshold"
                    name="highValueThreshold"
                    value={approvalWorkflows.highValueThreshold}
                    onChange={handleApprovalChange}
                  />
                  <span className="input-group-text">
                    <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
                <small className="text-muted mt-1 d-block">
                  Requisitions above this amount require additional approval
                </small>
              </div>

              <div className="mb-3 form-check">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    id="autoApproveLowValue"
                    name="autoApproveLowValue"
                    checked={approvalWorkflows.autoApproveLowValue}
                    onChange={handleApprovalChange}
                  />
                  <label htmlFor="autoApproveLowValue" className="form-check-label">
                    Auto-approve low-value requisitions
                  </label>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSaveWorkflows}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilitySettings;