import React, { useState, useEffect } from 'react';
import {
  FaPlus, FaSearch, FaEdit, FaTimes, FaCheck, FaUser, FaUserMd, FaUserCog, FaHospital,
  FaEnvelope, FaPhone, FaLock, FaKey, FaInfoCircle, FaUserCircle, FaSync
} from 'react-icons/fa';

const SuperAdminUsers = () => {
  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  // Current user
  const [currentUser, setCurrentUser] = useState(null);

  // New user form
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'Warehouse Admin', // ← string, not ID; Super Admin removed
    facility_id: 2,
    password: '',
    confirmPassword: ''
  });

  // Edit user form
  const [editUser, setEditUser] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'Warehouse Admin',
    facility_id: 2
  });

  // Status change
  const [newStatus, setNewStatus] = useState('');

  // Password reset
  const [resetPassword, setResetPassword] = useState({
    password: '',
    confirmPassword: ''
  });

  // Users data
  const [users, setUsers] = useState([]);
  
  // User summary stats
  const [userSummary, setUserSummary] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    medicalStaff: 0
  });

  // Loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock facilities - replace with API call if needed
  const facilities = [
    { id: 1, name: 'Main Warehouse' },
    { id: 2, name: 'Kumasi Branch Hospital' },
    { id: 3, name: 'Accra Central Hospital' },
    { id: 4, name: 'Takoradi Clinic' },
    { id: 5, name: 'Cape Coast Hospital' }
  ];

  // Generate random users data
  const generateRandomUsers = () => {
    try {
      setLoading(true);
      
      // First names and last names for generating random names
      const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Jennifer'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
      
      // User roles
      const roles = ['Warehouse Admin', 'Facility Manager', 'Medical Staff', 'Inventory Clerk', 'Regional Supervisor'];
      
      // Generate random users
      const randomUsers = Array.from({ length: 15 }, (_, i) => {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const role = roles[Math.floor(Math.random() * roles.length)];
        const facilityId = Math.floor(Math.random() * facilities.length) + 1;
        const status = Math.random() > 0.2 ? 'Active' : (Math.random() > 0.5 ? 'Inactive' : 'Pending');
        
        return {
          id: 1000 + i,
          full_name: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          phone: `+233 ${Math.floor(Math.random() * 90000000) + 10000000}`,
          role: role,
          facility_id: facilityId,
          status: status,
          lastLogin: status === 'Active' ? 
            new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString() : null,
          created_at: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString()
        };
      });
      
      // Calculate user summary stats
      const totalUsers = randomUsers.length;
      const activeUsers = randomUsers.filter(u => u.status === 'Active').length;
      const adminUsers = randomUsers.filter(u => u.role.includes('Admin') || u.role.includes('Manager') || u.role.includes('Supervisor')).length;
      const medicalStaff = randomUsers.filter(u => u.role.includes('Medical')).length;
      
      setUsers(randomUsers);
      setUserSummary({
        totalUsers,
        activeUsers,
        adminUsers,
        medicalStaff
      });
      setError(null);
    } catch (err) {
      setError('Failed to generate users data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    generateRandomUsers();
  }, []);

  // Status Badge only (RoleBadge removed)
  const StatusBadge = ({ status }) => {
    const map = {
      'Active': 'bg-success',
      'Inactive': 'bg-secondary',
      'Pending': 'bg-warning text-dark'
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
  };

  // Openers
  const openAddModal = () => {
    setNewUser({
      full_name: '',
      email: '',
      phone: '',
      role: 'Warehouse Admin',
      facility_id: 2,
      password: '',
      confirmPassword: ''
    });
    setShowAddModal(true);
  };
  
  const openViewModal = (user) => { 
    setCurrentUser(user); 
    setShowViewModal(true); 
  };
  
  const openEditModal = (user) => {
    setEditUser({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      facility_id: user.facility_id
    });
    setCurrentUser(user);
    setShowEditModal(true);
  };
  
  const openStatusModal = (user) => {
    setCurrentUser(user);
    setNewStatus(user.status === 'Active' ? 'Inactive' : 'Active');
    setShowStatusModal(true);
  };

  const openResetPasswordModal = (user) => {
    setCurrentUser(user);
    setResetPassword({
      password: '',
      confirmPassword: ''
    });
    setShowResetPasswordModal(true);
  };

  // Form handlers
  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({ ...prev, [name]: value }));
  };

  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target;
    setResetPassword(prev => ({ ...prev, [name]: value }));
  };

  // Actions (no API calls)
  const handleAddUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newUser.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const { confirmPassword, ...userData } = newUser;
      
      const newUserWithId = {
        ...userData,
        id: Math.max(...users.map(u => u.id), 0) + 1,
        status: 'Active',
        lastLogin: null,
        created_at: new Date().toISOString()
      };
      
      setUsers(prev => [...prev, newUserWithId]);
      
      // Update user summary
      setUserSummary(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + 1,
        activeUsers: prev.activeUsers + 1,
        adminUsers: prev.adminUsers + (newUser.role.includes('Admin') || newUser.role.includes('Manager') || newUser.role.includes('Supervisor') ? 1 : 0),
        medicalStaff: prev.medicalStaff + (newUser.role.includes('Medical') ? 1 : 0)
      }));
      
      setShowAddModal(false);
      setError(null);
      alert('User added successfully!');
    } catch (err) {
      console.error('Failed to add user:', err);
      setError('Failed to add user');
    }
  };

  const handleEditUser = () => {
    try {
      setUsers(prev => prev.map(u =>
        u.id === currentUser.id ? { 
          ...u, 
          ...editUser
        } : u
      ));
      
      // Update user summary if role changed
      const oldRole = users.find(u => u.id === currentUser.id)?.role;
      const newRole = editUser.role;
      
      if (oldRole !== newRole) {
        setUserSummary(prev => {
          const newSummary = { ...prev };
          
          // Adjust counts based on old role
          if (oldRole.includes('Admin') || oldRole.includes('Manager') || oldRole.includes('Supervisor')) {
            newSummary.adminUsers -= 1;
          }
          if (oldRole.includes('Medical')) {
            newSummary.medicalStaff -= 1;
          }
          
          // Adjust counts based on new role
          if (newRole.includes('Admin') || newRole.includes('Manager') || newRole.includes('Supervisor')) {
            newSummary.adminUsers += 1;
          }
          if (newRole.includes('Medical')) {
            newSummary.medicalStaff += 1;
          }
          
          return newSummary;
        });
      }
      
      setShowEditModal(false);
      alert('User updated successfully!');
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Failed to update user');
    }
  };

  const handleChangeStatus = () => {
    try {
      setUsers(prev => prev.map(u =>
        u.id === currentUser.id ? { 
          ...u, 
          status: newStatus,
          lastLogin: newStatus === 'Active' ? u.lastLogin : null
        } : u
      ));
      
      // Update user summary
      setUserSummary(prev => ({
        ...prev,
        activeUsers: newStatus === 'Active' ? prev.activeUsers + 1 : prev.activeUsers - 1
      }));
      
      setShowStatusModal(false);
      alert(`User ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      console.error('Failed to update user status:', err);
      setError('Failed to update user status');
    }
  };

  const handleResetPassword = () => {
    if (resetPassword.password !== resetPassword.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (resetPassword.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setShowResetPasswordModal(false);
      setError(null);
      alert('Password reset successfully!');
    } catch (err) {
      console.error('Failed to reset password:', err);
      setError('Failed to reset password');
    }
  };

  // Search filter – removed department & role_id logic
  const filtered = users.filter(u => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    
    const facility = facilities.find(f => f.id === u.facility_id);
    
    return (
      u.id?.toString().toLowerCase().includes(q) ||
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) || // ← role is now string
      facility?.name?.toLowerCase().includes(q) ||
      u.status?.toLowerCase().includes(q)
      // ❌ department removed
    );
  });

  return (
    <div className="container-fluid py-3">
      {/* Toolbar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-2 mb-4">
        <h2 className="fw-bold mb-0">User Management</h2>
        <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2 w-90 w-md-auto">
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-sm"
              style={{height: "40px"}} 
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary btn-sm" style={{height: "40px"}} type="button">
              <FaSearch />
            </button>
          </div>
          <button
            className="btn btn-primary btn-sm d-inline-flex align-items-center py-1 px-2"
            onClick={openAddModal}
            style={{height: "40px", width:"150px"}} 
          >
             Add New User
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaUser className="text-primary fs-3" />
              </div>
              <div className="text-primary fw-bold fs-4">{userSummary.totalUsers}</div>
              <div className="text-muted small">Total Users</div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaCheck className="text-success fs-3" />
              </div>
              <div className="text-success fw-bold fs-4">{userSummary.activeUsers}</div>
              <div className="text-muted small">Active Users</div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaUserCog className="text-warning fs-3" />
              </div>
              <div className="text-warning fw-bold fs-4">{userSummary.adminUsers}</div>
              <div className="text-muted small">Admin Users</div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaUserMd className="text-info fs-3" />
              </div>
              <div className="text-info fw-bold fs-4">{userSummary.medicalStaff}</div>
              <div className="text-muted small">Medical Staff</div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table & Cards */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold">System Users</h5>
        </div>

        {/* TABLE (md and up) */}
        <div className="card-body p-0 d-none d-md-block">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Facility</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th className="text-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, index) => {
                  const facility = facilities.find(f => f.id === user.facility_id);
                  return (
                    <tr key={index}>
                      <td className="fw-bold">{user.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-secondary bg-opacity-10 p-2 rounded-circle me-2">
                            <FaUser className="text-secondary" />
                          </div>
                          {user.full_name}
                        </div>
                      </td>
                      <td>{user.role || '—'}</td> {/* ← plain text, no badge */}
                      <td>{facility ? facility.name : 'Unknown'}</td>
                      <td>{user.email}</td>
                      <td><StatusBadge status={user.status} /></td>
                      <td>
                        <div className="btn-group" role="group">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openViewModal(user)}>
                            <FaInfoCircle />
                          </button>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openEditModal(user)}>
                            <FaEdit />
                          </button>
                          {user.status === 'Active' ? (
                            <button className="btn btn-sm btn-outline-danger" onClick={() => openStatusModal(user)}>
                              <FaTimes />
                            </button>
                          ) : (
                            <button className="btn btn-sm btn-outline-success" onClick={() => openStatusModal(user)}>
                              <FaCheck />
                            </button>
                          )}
                          <button className="btn btn-sm btn-outline-warning" onClick={() => openResetPasswordModal(user)}>
                            <FaSync />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CARD LIST (below md) */}
        <div className="card-body d-block d-md-none">
          <div className="row g-2">
            {filtered.map((u, i) => {
              const facility = facilities.find(f => f.id === u.facility_id);
              return (
                <div className="col-12" key={i}>
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold">{u.full_name}</span>
                        <StatusBadge status={u.status} />
                      </div>
                      <div className="row g-2 small">
                        <div className="col-6">
                          <div className="text-muted">User ID</div>
                          <div>{u.id}</div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted">Role</div>
                          <div>{u.role || '—'}</div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted">Facility</div>
                          <div>{facility ? facility.name : 'Unknown'}</div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted">Email</div>
                          <div className="text-truncate">{u.email}</div>
                        </div>
                        {/* ❌ Department removed */}
                        <div className="col-6">
                          <div className="text-muted">Phone</div>
                          <div>{u.phone}</div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted">Last Login</div>
                          <div>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</div>
                        </div>
                      </div>
                      <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-outline-primary w-100 btn-sm" onClick={() => openViewModal(u)}>
                          <FaInfoCircle className="me-1" /> Details
                        </button>
                        <button className="btn btn-outline-primary w-100 btn-sm" onClick={() => openEditModal(u)}>
                          <FaEdit className="me-1" /> Edit
                        </button>
                        {u.status === 'Active' ? (
                          <button className="btn btn-outline-danger w-100 btn-sm" onClick={() => openStatusModal(u)}>
                            <FaTimes className="me-1" /> Deactivate
                          </button>
                        ) : (
                          <button className="btn btn-outline-success w-100 btn-sm" onClick={() => openStatusModal(u)}>
                            <FaCheck className="me-1" /> Activate
                          </button>
                        )}
                        <button className="btn btn-outline-warning w-100 btn-sm" onClick={() => openResetPasswordModal(u)}>
                          <FaSync className="me-1" /> Reset Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && !loading && (
              <div className="col-12">
                <div className="alert alert-light border text-center mb-0">No users found.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New User</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" name="full_name" value={newUser.full_name} onChange={handleAddUserChange} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-control" name="email" value={newUser.email} onChange={handleAddUserChange} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input type="text" className="form-control" name="phone" value={newUser.phone} onChange={handleAddUserChange} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Role</label>
                      <select className="form-select" name="role" value={newUser.role} onChange={handleAddUserChange}>
                        <option value="Warehouse Admin">Warehouse Admin</option>
                        <option value="Facility Manager">Facility Manager</option>
                        <option value="Medical Staff">Medical Staff</option>
                        <option value="Inventory Clerk">Inventory Clerk</option>
                        <option value="Regional Supervisor">Regional Supervisor</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Facility</label>
                      <select className="form-select" name="facility_id" value={newUser.facility_id} onChange={handleAddUserChange}>
                        {facilities.map((facility) => (
                          <option key={facility.id} value={facility.id}>{facility.name}</option>
                        ))}
                      </select>
                    </div>
                    {/* ❌ Department removed */}
                    <div className="col-12 col-md-6">
                      <label className="form-label">Password</label>
                      <div className="input-group">
                        <input type="password" className="form-control" name="password" value={newUser.password} onChange={handleAddUserChange} />
                        <span className="input-group-text"><FaLock /></span>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Confirm Password</label>
                      <div className="input-group">
                        <input type="password" className="form-control" name="confirmPassword" value={newUser.confirmPassword} onChange={handleAddUserChange} />
                        <span className="input-group-text"><FaKey /></span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleAddUser}>Add User</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && currentUser && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details: {currentUser.full_name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaUserCircle className="text-primary" style={{ fontSize: '3rem' }} />
                  </div>
                  <h4 className="fw-bold">{currentUser.full_name}</h4>
                  <p className="text-muted">{currentUser.email}</p>
                </div>
                <div className="row g-3 mb-2">
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <FaUser className="text-primary me-2" />
                      <div>
                        <h6 className="mb-0">User ID</h6>
                        <p className="text-muted mb-0">{currentUser.id}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaUserCog className="text-primary me-2" />
                      <div>
                        <h6 className="mb-0">Role</h6>
                        <p className="text-muted mb-0">{currentUser.role || '—'}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaHospital className="text-primary me-2" />
                      <div>
                        <h6 className="mb-0">Facility</h6>
                        <p className="text-muted mb-0">
                          {facilities.find(f => f.id === currentUser.facility_id)?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <FaEnvelope className="text-primary me-2" />
                      <div>
                        <h6 className="mb-0">Email</h6>
                        <p className="text-muted mb-0">{currentUser.email}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaPhone className="text-primary me-2" />
                      <div>
                        <h6 className="mb-0">Phone</h6>
                        <p className="text-muted mb-0">{currentUser.phone}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaCheck className="text-primary me-2" />
                      <div>
                        <h6 className="mb-0">Status</h6>
                        <p className="mb-0"><StatusBadge status={currentUser.status} /></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <h6 className="mb-0">Join Date</h6>
                    <p className="text-muted mb-0">
                      {new Date(currentUser.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="col-12 col-md-6">
                    <h6 className="mb-0">Last Login</h6>
                    <p className="text-muted mb-0">
                      {currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
              {/* 🚫 Footer REMOVED — no Activate/Deactivate button here */}
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && currentUser && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User: {currentUser.full_name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" name="full_name" value={editUser.full_name} onChange={handleEditUserChange} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-control" name="email" value={editUser.email} onChange={handleEditUserChange} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input type="text" className="form-control" name="phone" value={editUser.phone} onChange={handleEditUserChange} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Role</label>
                      <select className="form-select" name="role" value={editUser.role} onChange={handleEditUserChange}>
                        <option value="Warehouse Admin">Warehouse Admin</option>
                        <option value="Facility Manager">Facility Manager</option>
                        <option value="Medical Staff">Medical Staff</option>
                        <option value="Inventory Clerk">Inventory Clerk</option>
                        <option value="Regional Supervisor">Regional Supervisor</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Facility</label>
                      <select className="form-select" name="facility_id" value={editUser.facility_id} onChange={handleEditUserChange}>
                        {facilities.map((facility) => (
                          <option key={facility.id} value={facility.id}>{facility.name}</option>
                        ))}
                      </select>
                    </div>
                    {/* ❌ Department removed */}
                  </div>
                </form>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleEditUser}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && currentUser && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentUser.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowStatusModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center">
                  <div className={`bg-${currentUser.status === 'Active' ? 'danger' : 'success'} bg-opacity-10 p-3 rounded-circle d-inline-block mb-3`}>
                    {currentUser.status === 'Active'
                      ? <FaTimes className="text-danger" style={{ fontSize: '2rem' }} />
                      : <FaCheck className="text-success" style={{ fontSize: '2rem' }} />
                    }
                  </div>
                  <h4 className="fw-bold">
                    {currentUser.status === 'Active' ? 'Deactivate User?' : 'Activate User?'}
                  </h4>
                  <p className="text-muted">
                    Are you sure you want to {currentUser.status === 'Active' ? 'deactivate' : 'activate'} <strong>{currentUser.full_name}</strong>?
                  </p>
                  <p className="text-muted">
                    {currentUser.status === 'Active'
                      ? 'The user will not be able to access the system until reactivated.'
                      : 'The user will regain access to the system with their current credentials.'}
                  </p>
                </div>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStatusModal(false)}>Cancel</button>
                <button type="button" className={`btn ${currentUser.status === 'Active' ? 'btn-danger' : 'btn-success'}`} onClick={handleChangeStatus}>
                  {currentUser.status === 'Active' ? <FaTimes className="me-2" /> : <FaCheck className="me-2" />}
                  {currentUser.status === 'Active' ? 'Deactivate' : 'Activate'} User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && currentUser && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reset Password for {currentUser.full_name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowResetPasswordModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <div className="input-group">
                      <input type="password" className="form-control" name="password" value={resetPassword.password} onChange={handleResetPasswordChange} />
                      <span className="input-group-text"><FaLock /></span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <div className="input-group">
                      <input type="password" className="form-control" name="confirmPassword" value={resetPassword.confirmPassword} onChange={handleResetPasswordChange} />
                      <span className="input-group-text"><FaKey /></span>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowResetPasswordModal(false)}>Cancel</button>
                <button type="button" className="btn btn-warning" onClick={handleResetPassword}>
                  <FaSync className="me-2" /> Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showAddModal || showViewModal || showEditModal || showStatusModal || showResetPasswordModal) && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default SuperAdminUsers;