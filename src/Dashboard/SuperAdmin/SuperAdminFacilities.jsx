import React, { useState, useEffect } from 'react';
import { 
  FaHospital, FaClinicMedical, FaFirstAid, FaWarehouse, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaEdit, FaTrash, FaSave, FaInfoCircle, FaBox, FaClipboardList, FaUserPlus
} from 'react-icons/fa';

const SuperAdminFacilities = () => {
  // State for modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignAdminModal, setShowAssignAdminModal] = useState(false);
  
  // State for current facility
  const [currentFacility, setCurrentFacility] = useState(null);
  
  // State for edit facility form
  const [editFacility, setEditFacility] = useState({
    name: '',
    type: 'Hospital',
    address: '',
    phone: '',
    email: '',
    description: '',
    capacity: '',
    services: '',
    inventory_level: 'Good',
    pending_requisitions: 0
  });
  
  // State for assign admin form
  const [adminEmail, setAdminEmail] = useState('');
  
  // State for facilities data
  const [facilities, setFacilities] = useState([]);
  
  // State for loading
  const [loading, setLoading] = useState(true);
  
  // State for error
  const [error, setError] = useState(null);
  
  // Generate random facilities data on component mount
  useEffect(() => {
    generateRandomFacilities();
  }, []);
  
  // Function to generate random facilities
  const generateRandomFacilities = () => {
    try {
      setLoading(true);
      
      // Facility types
      const facilityTypes = [
        'Hospital', 
        'Regional Facility', 
        'Metropolitan Facility', 
        'Community Health Center', 
        'Central Storage Facility', 
        'Coastal Regional Facility'
      ];
      
      // Facility names
      const hospitalNames = [
        'City General Hospital',
        'Regional Medical Center',
        'Metropolitan Hospital',
        'Community Health Center',
        'Central Medical Warehouse',
        'Coastal Regional Hospital'
      ];
      
      // Locations
      const locations = [
        '123 Main Street, Accra',
        '456 Health Avenue, Kumasi',
        '789 Medical Boulevard, Takoradi',
        '101 Wellness Road, Tamale',
        '202 Care Lane, Cape Coast',
        '303 Recovery Drive, Ho'
      ];
      
      // Services
      const servicesList = [
        'Emergency Care, General Surgery, Maternity',
        'Outpatient Services, Laboratory, Pharmacy',
        'Diagnostic Imaging, Physical Therapy, Cardiology',
        'Pediatrics, Neonatal Care, Immunization',
        'Storage, Distribution, Inventory Management',
        'Emergency Response, Trauma Care, Ambulance Services'
      ];
      
      // Admin emails
      const adminEmails = [
        'admin@facility1.com',
        'manager@facility2.com',
        'director@facility3.com',
        'supervisor@facility4.com',
        'Not Assigned',
        'administrator@facility6.com'
      ];
      
      // Generate random facilities
      const randomFacilities = Array.from({ length: 6 }, (_, i) => ({
        id: `FAC-${1000 + i}`,
        name: hospitalNames[i],
        type: facilityTypes[i],
        address: locations[i],
        phone: `+233 ${Math.floor(Math.random() * 90000000) + 10000000}`,
        email: `contact@facility${i+1}.com`,
        description: `This is a ${facilityTypes[i].toLowerCase()} providing comprehensive healthcare services to the community. Established in ${2010 + i}, it has been serving the region with dedication and excellence.`,
        capacity: `${Math.floor(Math.random() * 400) + 100} beds`,
        services: servicesList[i],
        inventoryLevel: ['Good', 'Low', 'Critical'][Math.floor(Math.random() * 3)],
        pendingRequisitions: Math.floor(Math.random() * 10),
        admin: adminEmails[i]
      }));
      
      setFacilities(randomFacilities);
      setError(null);
    } catch (err) {
      setError('Failed to generate facilities data. Please try again later.');
      console.error('Error generating facilities:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Modal handlers
  const openViewModal = (facility) => {
    setCurrentFacility(facility);
    setShowViewModal(true);
  };
  
  const openEditModal = (facility) => {
    setEditFacility({
      name: facility.name,
      type: facility.type,
      address: facility.address,
      phone: facility.phone,
      email: facility.email,
      description: facility.description,
      capacity: facility.capacity,
      services: facility.services,
      inventory_level: facility.inventoryLevel,
      pending_requisitions: facility.pendingRequisitions
    });
    setCurrentFacility(facility);
    setShowEditModal(true);
  };
  
  const openDeleteModal = (facility) => {
    setCurrentFacility(facility);
    setShowDeleteModal(true);
  };
  
  const openAssignAdminModal = (facility) => {
    setCurrentFacility(facility);
    setAdminEmail(facility.admin === 'Not Assigned' ? '' : facility.admin);
    setShowAssignAdminModal(true);
  };
  
  // Form handlers
  const handleEditFacilityChange = (e) => {
    const { name, value } = e.target;
    setEditFacility({
      ...editFacility,
      [name]: value
    });
  };
  
  const handleAdminEmailChange = (e) => {
    setAdminEmail(e.target.value);
  };
  
  // Action handlers
  const handleEditFacility = () => {
    // Update the facility in the state
    const updatedFacilities = facilities.map(facility => 
      facility.id === currentFacility.id 
        ? { 
            ...editFacility, 
            id: currentFacility.id,
            inventoryLevel: editFacility.inventory_level,
            pendingRequisitions: parseInt(editFacility.pending_requisitions)
          } 
        : facility
    );
    
    setFacilities(updatedFacilities);
    setShowEditModal(false);
    alert(`Facility ${currentFacility.name} has been updated successfully!`);
  };
  
  const handleDeleteFacility = () => {
    // Update the facilities list in state
    const updatedFacilities = facilities.filter(facility => 
      facility.id !== currentFacility.id
    );
    
    setFacilities(updatedFacilities);
    setShowDeleteModal(false);
    alert(`Facility ${currentFacility.name} has been deleted successfully!`);
  };
  
  const handleAssignAdmin = () => {
    // Update the facility in the state
    const updatedFacilities = facilities.map(facility => 
      facility.id === currentFacility.id 
        ? { ...facility, admin: adminEmail } 
        : facility
    );
    
    setFacilities(updatedFacilities);
    setShowAssignAdminModal(false);
    alert(`Admin has been assigned to ${currentFacility.name} successfully!`);
  };
  
  // Get inventory level badge
  const getInventoryBadge = (level) => {
    switch(level) {
      case 'Good':
        return <span className="badge bg-success">Good</span>;
      case 'Low':
        return <span className="badge bg-warning">Low</span>;
      case 'Critical':
        return <span className="badge bg-danger">Critical</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };
  
  return (
    <div className="fade-in">
      <h2 className="fw-bold mb-4">Facilities Management</h2>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading facilities...</p>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* Facilities Table */}
      {!loading && !error && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Facility ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Admin</th>
                    <th>Inventory Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.map((facility) => (
                    <tr key={facility.id}>
                      <td>{facility.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {getFacilityIcon(facility.type)}
                          <span className="ms-2">{facility.name}</span>
                        </div>
                      </td>
                      <td>{facility.address}</td>
                      <td>{facility.admin}</td>
                      <td>
                        {getInventoryBadge(facility.inventoryLevel)}
                        <div className="small text-muted mt-1">
                          Pending: <span className="badge bg-info">{facility.pendingRequisitions}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary" 
                            onClick={() => openViewModal(facility)}
                            title="View Details"
                          >
                            <FaInfoCircle />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-warning" 
                            onClick={() => openEditModal(facility)}
                            title="Edit Facility"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-info" 
                            onClick={() => openAssignAdminModal(facility)}
                            title="Assign Admin"
                          >
                            <FaUserPlus />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => openDeleteModal(facility)}
                            title="Delete Facility"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {facilities.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted">No facilities found</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* View Facility Modal */}
      {showViewModal && currentFacility && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Facility Details: {currentFacility.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    {getFacilityIcon(currentFacility.type)}
                  </div>
                  <h4 className="fw-bold">{currentFacility.name}</h4>
                  <p className="text-muted">{currentFacility.type}</p>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <FaMapMarkerAlt className="text-primary me-2" />
                      <div>
                        <h6 className="mb-0">Address</h6>
                        <p className="text-muted mb-0">{currentFacility.address}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <FaPhone className="text-primary me-2" />
                      <div>
                        <h6 className="mb-0">Phone</h6>
                        <p className="text-muted mb-0">{currentFacility.phone}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <FaBox className="text-primary me-2" />
                      <div>
                        <h6 className="mb-0">Inventory Level</h6>
                        <p className="mb-0">{getInventoryBadge(currentFacility.inventoryLevel)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <FaEnvelope className="text-primary me-2" />
                      <div>
                        <h6 className="mb-0">Email</h6>
                        <p className="text-muted mb-0">{currentFacility.email}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <FaInfoCircle className="text-primary me-2" />
                      <div>
                        <h6 className="mb-0">Capacity</h6>
                        <p className="text-muted mb-0">{currentFacility.capacity}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <FaClipboardList className="text-primary me-2" />
                      <div>
                        <h6 className="mb-0">Pending Requisitions</h6>
                        <p className="mb-0"><span className="badge bg-info">{currentFacility.pendingRequisitions}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h6 className="mb-2">Services</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      {currentFacility.services}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h6 className="mb-2">Description</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      {currentFacility.description}
                    </div>
                  </div>
                </div>
                
                <div className="d-flex justify-content-end">
                  <button className="btn btn-outline-warning me-2" onClick={() => openEditModal(currentFacility)}>
                    <FaEdit className="me-2" /> Edit
                  </button>
                  <button className="btn btn-outline-info me-2" onClick={() => openAssignAdminModal(currentFacility)}>
                    <FaUserPlus className="me-2" /> Assign Admin
                  </button>
                  <button className="btn btn-outline-danger" onClick={() => openDeleteModal(currentFacility)}>
                    <FaTrash className="me-2" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Facility Modal */}
      {showEditModal && currentFacility && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Facility: {currentFacility.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Facility Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="name"
                        value={editFacility.name}
                        onChange={handleEditFacilityChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Facility Type</label>
                      <select 
                        className="form-select" 
                        name="type"
                        value={editFacility.type}
                        onChange={handleEditFacilityChange}
                        required
                      >
                        <option value="Hospital">Hospital</option>
                        <option value="Regional Facility">Regional Facility</option>
                        <option value="Metropolitan Facility">Metropolitan Facility</option>
                        <option value="Community Health Center">Community Health Center</option>
                        <option value="Central Storage Facility">Central Storage Facility</option>
                        <option value="Coastal Regional Facility">Coastal Regional Facility</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="phone"
                        value={editFacility.phone}
                        onChange={handleEditFacilityChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        name="email"
                        value={editFacility.email}
                        onChange={handleEditFacilityChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="address"
                      value={editFacility.address}
                      onChange={handleEditFacilityChange}
                      required
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Capacity</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="capacity"
                        value={editFacility.capacity}
                        onChange={handleEditFacilityChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Services</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="services"
                        value={editFacility.services}
                        onChange={handleEditFacilityChange}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Inventory Level</label>
                      <select 
                        className="form-select" 
                        name="inventory_level"
                        value={editFacility.inventory_level}
                        onChange={handleEditFacilityChange}
                        required
                      >
                        <option value="Good">Good</option>
                        <option value="Low">Low</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Pending Requisitions</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="pending_requisitions"
                        value={editFacility.pending_requisitions}
                        onChange={handleEditFacilityChange}
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      name="description"
                      value={editFacility.description}
                      onChange={handleEditFacilityChange}
                      rows="3"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleEditFacility}>
                  <FaSave className="me-2" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Assign Admin Modal */}
      {showAssignAdminModal && currentFacility && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Admin to {currentFacility.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAssignAdminModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Admin Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={adminEmail}
                    onChange={handleAdminEmailChange}
                    placeholder="Enter admin email address"
                    required
                  />
                </div>
                <div className="text-muted small">
                  <p className="mb-0">Note: The admin must have an existing account in the system.</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAssignAdminModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-info" onClick={handleAssignAdmin}>
                  <FaUserPlus className="me-2" /> Assign Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Facility Modal */}
      {showDeleteModal && currentFacility && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Facility</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center">
                  <div className="bg-danger bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaTrash className="text-danger fa-2x" />
                  </div>
                  <h4 className="fw-bold">Are you sure?</h4>
                  <p className="text-muted">Do you really want to delete <strong>{currentFacility.name}</strong>? This process cannot be undone.</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteFacility}>
                  <FaTrash className="me-2" /> Delete Facility
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Backdrop */}
      {(showViewModal || showEditModal || showDeleteModal || showAssignAdminModal) && (
        <div className="modal-backdrop show"></div>
      )}
    </div>
  );
};

// Get icon based on facility type
const getFacilityIcon = (type) => {
  switch(type) {
    case 'Central Storage Facility':
      return <FaWarehouse className="text-primary" />;
    case 'Regional Facility':
    case 'Metropolitan Facility':
    case 'Coastal Regional Facility':
    case 'Hospital':
      return <FaHospital className="text-success" />;
    case 'Community Health Center':
      return <FaClinicMedical className="text-info" />;
    default:
      return <FaFirstAid className="text-warning" />;
  }
};

export default SuperAdminFacilities;