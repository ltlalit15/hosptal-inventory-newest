import React, { useState } from 'react';
import { 
  FaList, FaBell, FaSitemap, FaEdit, FaSave, FaCheck, FaTimes 
} from 'react-icons/fa';

const SuperAdminSettings = () => {
  // === Categories Management ===
  const [categories, setCategories] = useState(['Medicines', 'Surgical Supplies', 'Lab Reagents']);
  const [newCategory, setNewCategory] = useState('');

  // === Notification Rules ===
  const [notificationRules, setNotificationRules] = useState([
    { event: 'Low Stock Alert', channel: 'Email', enabled: true },
    { event: 'Item Expiry Warning', channel: 'Email + SMS', enabled: true },
    { event: 'Reorder Confirmation', channel: 'Email', enabled: false }
  ]);

  // === Approval Matrix ===
  const [approvalMatrix, setApprovalMatrix] = useState([
    { action: 'Purchase Order > $1000', approvers: 'Finance Manager', required: true },
    { action: 'Delete Critical Item', approvers: 'Admin + Department Head', required: true }
  ]);
  const [newApprovalRule, setNewApprovalRule] = useState({ action: '', approvers: '' });

  // === Modals ===
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showNotificationRulesModal, setShowNotificationRulesModal] = useState(false);
  const [showApprovalMatrixModal, setShowApprovalMatrixModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentSetting, setCurrentSetting] = useState('');

  // === Handlers ===
  const openConfirmationModal = (setting) => {
    setCurrentSetting(setting);
    setShowConfirmationModal(true);
  };

  const handleSaveCategories = (e) => {
    e.preventDefault();
    setShowCategoriesModal(false);
    openConfirmationModal('Categories');
  };

  const handleSaveNotificationRules = (e) => {
    e.preventDefault();
    setShowNotificationRulesModal(false);
    openConfirmationModal('Notification Rules');
  };

  const handleSaveApprovalMatrix = (e) => {
    e.preventDefault();
    if (newApprovalRule.action && newApprovalRule.approvers) {
      setApprovalMatrix([
        ...approvalMatrix,
        { 
          action: newApprovalRule.action, 
          approvers: newApprovalRule.approvers, 
          required: true 
        }
      ]);
      setNewApprovalRule({ action: '', approvers: '' });
    }
    setShowApprovalMatrixModal(false);
    openConfirmationModal('Approval Matrix');
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const toggleNotificationRule = (index) => {
    const updated = [...notificationRules];
    updated[index].enabled = !updated[index].enabled;
    setNotificationRules(updated);
  };

  const handleConfirm = () => setShowConfirmationModal(false);

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Company Settings</h2>
      </div>

      {/* Categories Management */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold d-flex align-items-center">
            <FaList className="me-2" /> Categories Management
          </h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            {categories.length > 0 ? (
              <ul className="list-unstyled">
                {categories.map((cat, i) => (
                  <li key={i} className="d-flex justify-content-between align-items-center py-1">
                    <span>{cat}</span>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => handleRemoveCategory(i)}
                    >
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No categories defined.</p>
            )}
          </div>
          <button 
            className="btn btn-outline-primary " 
            onClick={() => setShowCategoriesModal(true)}
          >
            <FaEdit className="me-2" /> Manage Categories
          </button>
        </div>
      </div>

      {/* Notification Rules */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold d-flex align-items-center">
            <FaBell className="me-2" /> Notification Rules
          </h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            {notificationRules.map((rule, i) => (
              <div key={i} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <strong>{rule.event}</strong><br />
                  <small className="text-muted">Channel: {rule.channel}</small>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => toggleNotificationRule(i)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button 
            className="btn btn-outline-primary " 
            onClick={() => setShowNotificationRulesModal(true)}
          >
            <FaEdit className="me-2" /> Configure Notification Rules
          </button>
        </div>
      </div>

      {/* Approval Matrix */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold d-flex align-items-center">
            <FaSitemap className="me-2" /> Approval Matrix
          </h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            {approvalMatrix.length > 0 ? (
              <ul className="list-unstyled">
                {approvalMatrix.map((rule, i) => (
                  <li key={i} className="py-2 border-bottom">
                    <strong>{rule.action}</strong><br />
                    <small className="text-muted">Approvers: {rule.approvers}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No approval rules defined.</p>
            )}
          </div>
          <button 
            className="btn btn-outline-primary " 
            onClick={() => setShowApprovalMatrixModal(true)}
          >
            <FaEdit className="me-2" /> Manage Approval Matrix
          </button>
        </div>
      </div>

      {/* === MODALS === */}

      {/* Categories Modal */}
      {showCategoriesModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  <FaList className="me-2" /> Manage Categories
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCategoriesModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSaveCategories}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Add New Category</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="e.g., Diagnostic Equipment"
                      />
                      <button 
                        className="btn btn-outline-primary" 
                        type="button" 
                        onClick={handleAddCategory}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Current Categories</label>
                    {categories.length > 0 ? (
                      <ul className="list-group">
                        {categories.map((cat, i) => (
                          <li key={i} className="list-group-item d-flex justify-content-between">
                            {cat}
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              onClick={() => handleRemoveCategory(i)}
                            >
                              <FaTimes />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No categories yet.</p>
                    )}
                  </div>
                  <div className="d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-secondary me-2" 
                      onClick={() => setShowCategoriesModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <FaSave className="me-2" /> Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Rules Modal */}
      {showNotificationRulesModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  <FaBell className="me-2" /> Notification Rules
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowNotificationRulesModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSaveNotificationRules}>
                  <p>Enable or disable notifications for system events:</p>
                  {notificationRules.map((rule, i) => (
                    <div key={i} className="card mb-3">
                      <div className="card-body">
                        <h6>{rule.event}</h6>
                        <p className="text-muted mb-2">Channel: {rule.channel}</p>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={rule.enabled}
                            onChange={() => toggleNotificationRule(i)}
                          />
                          <label className="form-check-label">
                            {rule.enabled ? 'Enabled' : 'Disabled'}
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-secondary me-2" 
                      onClick={() => setShowNotificationRulesModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <FaSave className="me-2" /> Save Rules
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Matrix Modal */}
      {showApprovalMatrixModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  <FaSitemap className="me-2" /> Approval Matrix
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowApprovalMatrixModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSaveApprovalMatrix}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Add New Approval Rule</label>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Action (e.g., PO > $5000)"
                          value={newApprovalRule.action}
                          onChange={(e) => setNewApprovalRule({...newApprovalRule, action: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Approvers (e.g., Finance + Admin)"
                          value={newApprovalRule.approvers}
                          onChange={(e) => setNewApprovalRule({...newApprovalRule, approvers: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Current Rules</label>
                    {approvalMatrix.length > 0 ? (
                      <ul className="list-group">
                        {approvalMatrix.map((rule, i) => (
                          <li key={i} className="list-group-item">
                            <strong>{rule.action}</strong><br />
                            <small>Approvers: {rule.approvers}</small>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No rules defined.</p>
                    )}
                  </div>
                  <div className="d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-secondary me-2" 
                      onClick={() => setShowApprovalMatrixModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <FaSave className="me-2" /> Save Matrix
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleConfirm}
                ></button>
              </div>
              <div className="modal-body text-center">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                  <FaCheck className="text-success fa-2x" />
                </div>
                <h5 className="fw-bold">Settings Saved!</h5>
                <p>Your <strong>{currentSetting}</strong> have been updated successfully.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleConfirm}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(showCategoriesModal || showNotificationRulesModal || showApprovalMatrixModal || showConfirmationModal) && (
        <div className="modal-backdrop show"></div>
      )}
    </div>
  );
};

export default SuperAdminSettings;