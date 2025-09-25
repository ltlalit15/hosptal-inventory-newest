import React, { useState } from 'react';
import {
  FaHospital, FaTags, FaPlus, FaTrash, FaSearch, FaFilter
} from 'react-icons/fa';

const FacilityDepartmentsCategories = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('departments');

  // State for modals
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showRemoveDepartmentModal, setShowRemoveDepartmentModal] = useState(false);

  // Sample data for departments (simplified to match requirements)
  const departments = [
    { id: 'DPT-001', name: 'General Ward', head: 'Dr. Smith' },
    { id: 'DPT-002', name: 'ICU', head: 'Dr. Johnson' },
    { id: 'DPT-003', name: 'Pharmacy', head: 'Dr. Williams' },
    { id: 'DPT-004', name: 'Operating Theater 1', head: 'Dr. Brown' },
    { id: 'DPT-005', name: 'Operating Theater 2', head: 'Dr. Davis' },
  ];

  // Render the active tab content
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'departments':
        return (
          <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h1 className="mb-0">Departments & Categories</h1>
                <p className="text-muted mt-2 mb-0">
                  Easily manage hospital departments and their assigned categories.
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setShowAddDepartmentModal(true)}
              >
                <FaPlus className="me-2" /> Add Department
              </button>
            </div>

            <div className="card">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Departments</h5>
                <div className="d-flex gap-2">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text"><FaSearch /></span>
                    <input type="text" className="form-control" placeholder="Search departments..." />
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
                        <th>Dept ID</th>
                        <th>Name</th>
                        <th>Head</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map(dept => (
                        <tr key={dept.id}>
                          <td className="fw-medium">{dept.id}</td>
                          <td>{dept.name}</td>
                          <td>{dept.head}</td>
                          <td>
                            <div className="btn-group" role="group">
                              {/* Removed Update button */}
                              <button className="btn btn-sm btn-outline-danger" onClick={() => setShowRemoveDepartmentModal(true)}>
                                <FaTrash />
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          {renderActiveTab()}
        </div>
      </div>

      {/* Add Department Modal */}
      <div className={`modal fade ${showAddDepartmentModal ? 'show' : ''}`} style={{ display: showAddDepartmentModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Department</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddDepartmentModal(false)}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Department ID</label>
                  <input type="text" className="form-control" placeholder="e.g., DPT-006" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Department Name</label>
                  <input type="text" className="form-control" placeholder="Enter department name" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Head of Department</label>
                  <input type="text" className="form-control" placeholder="Enter head name" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddDepartmentModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary">Add Department</button>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Department Modal */}
      <div className={`modal fade ${showRemoveDepartmentModal ? 'show' : ''}`} style={{ display: showRemoveDepartmentModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Remove Department</h5>
              <button type="button" className="btn-close" onClick={() => setShowRemoveDepartmentModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to remove <strong>General Ward</strong>?</p>
              <p className="text-muted">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowRemoveDepartmentModal(false)}>Cancel</button>
              <button type="button" className="btn btn-danger">Remove Department</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {(showAddDepartmentModal || showRemoveDepartmentModal) &&
        <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default FacilityDepartmentsCategories;
