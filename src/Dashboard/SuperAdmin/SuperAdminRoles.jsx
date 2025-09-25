import React, { useState } from "react";
import {
  FaUserShield,
  FaWarehouse,
  FaHospital,
  FaUser,
  FaEdit,
  FaTrash,
  FaEye,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const SimpleRolePermissions = () => {
  // Roles data
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Super Admin",
      description: "Full system access",
      permissions: {
        view: true,
        edit: true,
        delete: true,
      },
    },
    {
      id: 2,
      name: "Warehouse Admin",
      description: "Manage warehouse operations",
      permissions: {
        view: true,
        edit: true,
        delete: false,
      },
    },
    {
      id: 3,
      name: "Facility Admin",
      description: "Manage facility operations",
      permissions: {
        view: true,
        edit: true,
        delete: false,
      },
    },
    {
      id: 4,
      name: "Facility User",
      description: "Limited access",
      permissions: {
        view: true,
        edit: false,
        delete: false,
      },
    },
  ]);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  
  // Edit permissions form
  const [editPermissions, setEditPermissions] = useState({
    view: false,
    edit: false,
    delete: false,
  });

  // Open edit modal
  const openEditModal = (role) => {
    setCurrentRole(role);
    setEditPermissions({ ...role.permissions });
    setShowEditModal(true);
  };

  // Handle permission change
  const handlePermissionChange = (permission) => {
    setEditPermissions({
      ...editPermissions,
      [permission]: !editPermissions[permission],
    });
  };

  // Save permissions
  const handleSavePermissions = () => {
    setRoles(
      roles.map((role) =>
        role.id === currentRole.id
          ? { ...role, permissions: editPermissions }
          : role
      )
    );
    setShowEditModal(false);
    alert("Permissions updated successfully!");
  };

  // Permission badge
  const PermissionBadge = ({ hasPermission }) => (
    <span
      className={`badge ${hasPermission ? "bg-success" : "bg-danger"} rounded-circle p-2`}
    >
      {hasPermission ? <FaTimes /> : <FaTimes />}
    </span>
  );

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Role Permissions</h2>
      </div>

      {/* Roles Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Manage Role Permissions</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Role ID</th>
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>View</th>
                  <th>Edit</th>
                  <th>Delete</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        {role.id === 1 && <FaUserShield className="text-danger me-2" />}
                        {role.id === 2 && <FaWarehouse className="text-primary me-2" />}
                        {role.id === 3 && <FaHospital className="text-info me-2" />}
                        {role.id === 4 && <FaUser className="text-success me-2" />}
                        {role.name}
                      </div>
                    </td>
                    <td>{role.description}</td>
                    <td className="text-center">
                      <PermissionBadge hasPermission={role.permissions.view} />
                    </td>
                    <td className="text-center">
                      <PermissionBadge hasPermission={role.permissions.edit} />
                    </td>
                    <td className="text-center">
                      <PermissionBadge hasPermission={role.permissions.delete} />
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEditModal(role)}
                      >
                        <FaEdit /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Permissions Modal */}
      {showEditModal && currentRole && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Edit Permissions: {currentRole.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p className="text-muted">{currentRole.description}</p>
                </div>
                
                <div className="list-group">
                  <div className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>View Permission</strong>
                        <p className="mb-0 text-muted small">
                          Allows user to view records and information
                        </p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={editPermissions.view}
                          onChange={() => handlePermissionChange("view")}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Edit Permission</strong>
                        <p className="mb-0 text-muted small">
                          Allows user to modify and update records
                        </p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={editPermissions.edit}
                          onChange={() => handlePermissionChange("edit")}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Delete Permission</strong>
                        <p className="mb-0 text-muted small">
                          Allows user to remove records from the system
                        </p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={editPermissions.delete}
                          onChange={() => handlePermissionChange("delete")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSavePermissions}
                >
                  <FaSave className="me-2" /> Save Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showEditModal && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default SimpleRolePermissions;