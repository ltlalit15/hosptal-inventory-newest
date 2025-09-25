import React, { useState } from 'react';
import {
  FaUser, FaUserShield, FaPlus, FaKey, FaLock, FaUnlock,
  FaSearch, FaFilter, FaEdit, FaTrash
} from 'react-icons/fa';

const FacilityUsersRoles = () => {
  // State for modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showLockUnlockModal, setShowLockUnlockModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  // Sample data for users (simplified to match requirements)
  const users = [
    {
      id: 'USR-001',
      name: 'John Smith',
      role: 'Administrator',
      status: 'Active'
    },
    {
      id: 'USR-002',
      name: 'Sarah Johnson',
      role: 'Pharmacist',
      status: 'Active'
    },
    {
      id: 'USR-003',
      name: 'Michael Brown',
      role: 'Ward Manager',
      status: 'Locked'
    },
    {
      id: 'USR-004',
      name: 'Emily Davis',
      role: 'Nurse',
      status: 'Active'
    },
    {
      id: 'USR-005',
      name: 'David Wilson',
      role: 'Doctor',
      status: 'Active'
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="mb-0">Users & Roles</h1>
              <p className="text-muted mt-2 mb-0">
                Manage all system users, their assigned roles, and account access.
              </p>
            </div>

            <button className="btn btn-primary" onClick={() => setShowAddUserModal(true)}>
              <FaPlus className="me-2" /> Add User
            </button>
          </div>

          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Users & Roles</h5>
              <div className="d-flex gap-2">
                <div className="input-group input-group-sm">
                  <span className="input-group-text"><FaSearch /></span>
                  <input type="text" className="form-control" placeholder="Search users..." />
                </div>
                <button className="btn btn-sm btn-outline-secondary">
                  <FaFilter />
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="fw-medium">{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.role}</td>
                        <td>
                          <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowEditUserModal(true)}>
                              <FaEdit />
                            </button>
                            <button className="btn btn-sm btn-outline-warning" onClick={() => setShowResetPasswordModal(true)}>
                              <FaKey />
                            </button>
                            <button
                              className={`btn btn-sm ${user.status === 'Active' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => setShowLockUnlockModal(true)}
                            >
                              {user.status === 'Active' ? <FaLock /> : <FaUnlock />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Add User Modal */}
      <div className={`modal fade ${showAddUserModal ? 'show' : ''}`} style={{ display: showAddUserModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New User</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddUserModal(false)}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">User ID</label>
                  <input type="text" className="form-control" placeholder="e.g., USR-006" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" placeholder="Enter full name" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" placeholder="Enter email address" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select className="form-select">
                    <option value="">Select role</option>
                    <option value="admin">Administrator</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="ward_manager">Ward Manager</option>
                    <option value="nurse">Nurse</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select">
                    <option value="active">Active</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary">Add User</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <div className={`modal fade ${showEditUserModal ? 'show' : ''}`} style={{ display: showEditUserModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
              <button type="button" className="btn-close" onClick={() => setShowEditUserModal(false)}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">User ID</label>
                  <input type="text" className="form-control" defaultValue="USR-001" readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" defaultValue="John Smith" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select className="form-select" defaultValue="admin">
                    <option value="admin">Administrator</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="ward_manager">Ward Manager</option>
                    <option value="nurse">Nurse</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" defaultValue="active">
                    <option value="active">Active</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowEditUserModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary">Update User</button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <div className={`modal fade ${showResetPasswordModal ? 'show' : ''}`} style={{ display: showResetPasswordModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Reset Password</h5>
              <button type="button" className="btn-close" onClick={() => setShowResetPasswordModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to reset the password for <strong>John Smith</strong>?</p>
              <p className="text-muted">A temporary password will be generated and sent to the user's email address.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowResetPasswordModal(false)}>Cancel</button>
              <button type="button" className="btn btn-warning">Reset Password</button>
            </div>
          </div>
        </div>
      </div>

      {/* Lock/Unlock User Modal */}
      <div className={`modal fade ${showLockUnlockModal ? 'show' : ''}`} style={{ display: showLockUnlockModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Lock User Account</h5>
              <button type="button" className="btn-close" onClick={() => setShowLockUnlockModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to <strong>lock</strong> the account for <strong>John Smith</strong>?</p>
              <p className="text-muted">The user will not be able to log in until the account is unlocked.</p>
              <div className="mb-3">
                <label className="form-label">Reason (Optional)</label>
                <textarea className="form-control" rows="3" placeholder="Enter reason for locking account"></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowLockUnlockModal(false)}>Cancel</button>
              <button type="button" className="btn btn-danger">Lock Account</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {(showAddUserModal || showEditUserModal || showResetPasswordModal || showLockUnlockModal) &&
        <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default FacilityUsersRoles;