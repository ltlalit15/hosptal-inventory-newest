import React, { useState } from "react";
import {
  FaCog,
  FaSave,
  FaBell,
  FaExclamationTriangle,
  FaBoxOpen
} from "react-icons/fa";

const SuperAdminSettings = () => {
  // ----------- Notification Settings -----------
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [expiryAlerts, setExpiryAlerts] = useState(true);
  const [dispatchAlerts, setDispatchAlerts] = useState(true);
  
  // ----------- Stock Thresholds -----------
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [expiryWarningDays, setExpiryWarningDays] = useState(30);
  const [reorderPoint, setReorderPoint] = useState(15);
  const [maximumStockLevel, setMaximumStockLevel] = useState(100);

  // ----------- Submit -----------
  const handleSave = (e) => {
    e.preventDefault();
    const settings = {
      notifications: {
        emailNotifications,
        smsNotifications,
        lowStockAlerts,
        expiryAlerts,
        dispatchAlerts
      },
      stockThresholds: {
        lowStockThreshold,
        expiryWarningDays,
        reorderPoint,
        maximumStockLevel
      }
    };
    console.log("Settings Saved ✅", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="fade-in container py-4">
      <h2 className="fw-bold mb-4">Settings</h2>
      <form onSubmit={handleSave}>
        <div className="row">
          {/* ---------------- Notification Settings ---------------- */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pt-3">
                <h5 className="fw-bold d-flex align-items-center">
                  <FaBell className="me-2" /> Notification Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="emailNotifications"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="emailNotifications">
                    Email Notifications
                  </label>
                </div>
                
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="smsNotifications"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="smsNotifications">
                    SMS Notifications
                  </label>
                </div>
                
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="lowStockAlerts"
                    checked={lowStockAlerts}
                    onChange={(e) => setLowStockAlerts(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="lowStockAlerts">
                    Low Stock Alerts
                  </label>
                </div>
                
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="expiryAlerts"
                    checked={expiryAlerts}
                    onChange={(e) => setExpiryAlerts(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="expiryAlerts">
                    Expiry Alerts
                  </label>
                </div>
                
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="dispatchAlerts"
                    checked={dispatchAlerts}
                    onChange={(e) => setDispatchAlerts(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="dispatchAlerts">
                    Dispatch Alerts
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* ---------------- Stock Thresholds ---------------- */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pt-3">
                <h5 className="fw-bold d-flex align-items-center">
                  <FaBoxOpen className="me-2" /> Stock Thresholds
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <FaExclamationTriangle className="me-2" /> Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                  <div className="form-text">
                    Alert when stock falls below this quantity
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <FaExclamationTriangle className="me-2" /> Expiry Warning Days
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={expiryWarningDays}
                    onChange={(e) => setExpiryWarningDays(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                  <div className="form-text">
                    Send alert this many days before items expire
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Reorder Point
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={reorderPoint}
                    onChange={(e) => setReorderPoint(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                  <div className="form-text">
                    Automatically create reorder when stock reaches this level
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Maximum Stock Level
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={maximumStockLevel}
                    onChange={(e) => setMaximumStockLevel(parseInt(e.target.value) || 0)}
                    min="0"
                  />
                  <div className="form-text">
                    Maximum quantity of stock that should be maintained
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Save All */}
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center"
          >
            <FaSave className="me-2" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuperAdminSettings;